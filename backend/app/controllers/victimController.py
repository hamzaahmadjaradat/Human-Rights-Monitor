from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime
from backend.database import victims_collection, victim_risk_assessments_collection
from backend.models.victimModel import VictimCreate, RiskUpdate

def add_victim_controller(data: VictimCreate):
    victim_dict = data.dict()
    victim_dict["created_at"] = datetime.utcnow()

    result = victims_collection.insert_one(victim_dict)

    risk_record = {
        "victim_id": str(result.inserted_id),
        "risk_level": data.risk_level,
        "updated_by": data.added_by,
        "timestamp": datetime.utcnow()
    }
    victim_risk_assessments_collection.insert_one(risk_record)

    return {"message": "Victim added", "victim_id": str(result.inserted_id)}

def get_victim_controller(victim_id: str):
    if not ObjectId.is_valid(victim_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    victim = victims_collection.find_one({"_id": ObjectId(victim_id)})

    if not victim:
        raise HTTPException(status_code=404, detail="Victim not found")

    return {
        "id": str(victim["_id"]),
        "pseudonym": victim.get("pseudonym"),
        "risk_level": victim["risk_level"],
        "case_id": victim["case_id"]
    }

def update_risk_controller(victim_id: str, update_data: RiskUpdate):
    if not ObjectId.is_valid(victim_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = victims_collection.update_one(
        {"_id": ObjectId(victim_id)},
        {"$set": {"risk_level": update_data.new_risk_level}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Victim not found")

    victim_risk_assessments_collection.insert_one({
        "victim_id": victim_id,
        "risk_level": update_data.new_risk_level,
        "updated_by": update_data.updated_by,
        "timestamp": datetime.utcnow()
    })

    return {"message": "Risk level updated"}

def list_victims_by_case_controller(case_id: str):
    victims = victims_collection.find({"case_id": case_id})
    return [
        {
            "id": str(v["_id"]),
            "pseudonym": v.get("pseudonym"),
            "risk_level": v["risk_level"]
        }
        for v in victims
    ]
