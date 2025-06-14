from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from app.database import cases_collection, case_status_history_collection
from app.models.caseModel import CaseStatusUpdate, CaseCreate
import os
import shutil
import json
from fastapi.responses import JSONResponse


async def create_case_controller(
    title, description, violation_types, status, priority,
    location, date_occurred, date_reported,
    victims, perpetrators, created_by,
    evidence_description, evidence_date, case_id, evidence_files
):
    if not case_id:
        case_id = f"HRM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    upload_dir = f"files/{case_id}"
    os.makedirs(upload_dir, exist_ok=True)

    evidence_data = []
    if evidence_files:
        for file in evidence_files:
            file_path = os.path.join(upload_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            evidence_data.append({
                "type": file.content_type.split("/")[0],
                "url": f"/{file_path}",
                "description": evidence_description,
                "date_captured": evidence_date
            })

    try:
        case_doc = {
            "case_id": case_id,
            "title": title,
            "description": description,
            "violation_types": json.loads(violation_types),
            "status": status,
            "priority": priority,
            "location": json.loads(location),
            "date_occurred": date_occurred,
            "date_reported": date_reported,
            "victims": [ObjectId(v) for v in json.loads(victims)] if victims else [],
            "perpetrators": json.loads(perpetrators) if perpetrators else [],
            "evidence": evidence_data,
            "created_by": ObjectId(created_by),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "archived": False
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid input: {str(e)}"})

    result = cases_collection.insert_one(case_doc)
    return {"message": "Case created", "case_id": str(result.inserted_id)}


def get_case_by_id_controller(case_id: str):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")

    case = cases_collection.find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return serialize_case(case)


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


def serialize_case(case):
    case["_id"] = str(case["_id"])

    if "date_occurred" in case and isinstance(case["date_occurred"], datetime):
        case["date_occurred"] = case["date_occurred"].isoformat()

    if "date_reported" in case and isinstance(case["date_reported"], datetime):
        case["date_reported"] = case["date_reported"].isoformat()

    if "created_at" in case and isinstance(case["created_at"], datetime):
        case["created_at"] = case["created_at"].isoformat()

    if "updated_at" in case and isinstance(case["updated_at"], datetime):
        case["updated_at"] = case["updated_at"].isoformat()

    if "created_by" in case and isinstance(case["created_by"], ObjectId):
        case["created_by"] = str(case["created_by"])

    if "victims" in case and isinstance(case["victims"], list):
        case["victims"] = [str(v) for v in case["victims"]]

    if "perpetrators" in case and isinstance(case["perpetrators"], list):
        for p in case["perpetrators"]:
            if isinstance(p, dict):
                for k, v in p.items():
                    if isinstance(v, ObjectId):
                        p[k] = str(v)

    if "evidence" in case and isinstance(case["evidence"], list):
        for e in case["evidence"]:
            if "date_captured" in e and isinstance(e["date_captured"], datetime):
                e["date_captured"] = e["date_captured"].isoformat()

    return case



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




def list_cases_controller(region, violation, status, date_from, date_to, page, limit, title=None):
    query = {
        "$or": [
            {"archived": False},
            {"archived": {"$exists": False}}
        ]
    }

    if region:
        query["location.region"] = region

    if status:
        query["status"] = status

    if title:
        query["title"] = {
            "$regex": f".*{title}.*",
            "$options": "i"  # Case-insensitive partial match
        }

    if violation:
        violations_list = violation.split(",")
        query["violation_types"] = {"$in": violations_list}

    date_filter = {}
    try:
        if date_from:
            date_filter["$gte"] = datetime.fromisoformat(date_from)
        if date_to:
            date_filter["$lte"] = datetime.fromisoformat(date_to)
    except:
        pass

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

    results = [serialize_case(c) for c in cases]

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": results
    }

def get_all_regions_controller():
    try:
        regions = cases_collection.distinct("location.region", {"archived": {"$ne": True}})
        return sorted([r for r in regions if r])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching regions: {str(e)}")