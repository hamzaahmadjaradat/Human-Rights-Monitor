from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from app.database import cases_collection, case_status_history_collection
from app.models.caseModel import CaseCreate, CaseStatusUpdate


async def create_case_controller(case: CaseCreate):
    case_dict = case.dict()
    case_dict["created_at"] = datetime.utcnow()
    case_dict["updated_at"] = datetime.utcnow()
    case_dict["archived"] = False
    result = cases_collection.insert_one(case_dict)
    return {"message": "Case created", "case_id": str(result.inserted_id)}


def get_case_by_id_controller(case_id: str):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")

    case = cases_collection.find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case["_id"] = str(case["_id"])
    return case


def update_case_status_controller(case_id: str, update_data: CaseStatusUpdate):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")

    case = cases_collection.find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    old_status = case.get("status")
    new_status = update_data.new_status

    if old_status == new_status and not (update_data.reason or update_data.notes):
        raise HTTPException(status_code=400, detail="Case is already in this status")

    cases_collection.update_one(
        {"_id": ObjectId(case_id)},
        {
            "$set": {
                "status": new_status,
                "updated_at": datetime.utcnow()
            }
        }
    )

    case_status_history_collection.insert_one({
        "case_id": case_id,
        "old_status": old_status,
        "new_status": new_status,
        "reason": update_data.reason,
        "notes": update_data.notes,
        "changed_by": update_data.changed_by,
        "changed_at": datetime.utcnow()
    })

    return {
        "message": "Case status updated",
        "old_status": old_status,
        "new_status": new_status
    }
def list_cases_controller(region, violation, status, date_from, date_to, page, limit):
    query = {
        "$or": [
            {"archived": False},
            {"archived": {"$exists": False}}  # Include documents without 'archived' field
        ]
    }

    if region:
        query["location.region"] = region

    if violation:
        query["violation_types"] = violation

    if status:
        query["status"] = status

    date_filter = {}
    if date_from:
        date_filter["$gte"] = datetime.fromisoformat(date_from)
    if date_to:
        date_filter["$lte"] = datetime.fromisoformat(date_to)
    if date_filter:
        query["date_occurred"] = date_filter

    skip = (page - 1) * limit

    total = cases_collection.count_documents(query)
    cases = list(
        cases_collection.find(query)
        .sort("date_occurred", -1)
        .skip(skip)
        .limit(limit)
    )

    for case in cases:
        case["_id"] = str(case["_id"])
        case["date_occurred"] = case["date_occurred"].isoformat()
        case["date_reported"] = case.get("date_reported", "").isoformat() if case.get("date_reported") else None
        case["created_at"] = case["created_at"].isoformat()
        case["updated_at"] = case["updated_at"].isoformat()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": cases
    }


def archive_case_controller(case_id: str):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")

    result = cases_collection.update_one(
        {"_id": ObjectId(case_id)},
        {
            "$set": {
                "archived": True,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")

    return {"message": "Case archived successfully"}
