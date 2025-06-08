from app.models.caseModel import CaseCreate
from app.database import cases_collection
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def create_case_controller(case: CaseCreate):
    case_dict = case.dict()
    case_dict["created_at"] = datetime.utcnow()
    case_dict["updated_at"] = datetime.utcnow()
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