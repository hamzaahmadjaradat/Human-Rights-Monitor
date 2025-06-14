from app.database import individuals_collection
from bson import ObjectId, json_util
from fastapi import HTTPException
import json
from datetime import datetime
from bson.errors import InvalidId

def get_all_victims_controller():
    victims_cursor = individuals_collection.find({"type": "victim"})
    victims_json_str = json_util.dumps(list(victims_cursor))
    return json.loads(victims_json_str)

def create_individual_controller(data: dict):
    try:
        # Convert string IDs to ObjectId
        if "cases_involved" in data:
            data["cases_involved"] = [ObjectId(cid) for cid in data["cases_involved"]]
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()

        result = individuals_collection.insert_one(data)
        return {"message": "Individual created", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def get_victim_by_id_controller(victim_id: str):
    try:
        _id = ObjectId(victim_id)
    except InvalidId:
        return None

    victim_doc = individuals_collection.find_one({"_id": _id, "type": "victim"})
    if not victim_doc:
        return None

    return json.loads(json_util.dumps(victim_doc))