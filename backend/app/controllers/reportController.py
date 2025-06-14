import os
from fastapi import HTTPException, UploadFile
from typing import List, Optional
from app.database import db
from bson import ObjectId
from datetime import datetime
from geopy.geocoders import Nominatim

incident_collection = db["incident_reports"]
evidence_collection = db["report_evidence"]

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

allowed_statuses = ["new", "under_investigation", "resolved"]
allowed_violations = ["arbitrary_detention", "torture", "forced_disappearance"]

def serialize_report(report: dict) -> dict:
    report["_id"] = str(report["_id"])
    if "assigned_to" in report and isinstance(report["assigned_to"], ObjectId):
        report["assigned_to"] = str(report["assigned_to"])
    if "created_at" in report and isinstance(report["created_at"], datetime):
        report["created_at"] = report["created_at"].isoformat()
    if isinstance(report.get("incident_details", {}).get("date"), datetime):
        report["incident_details"]["date"] = report["incident_details"]["date"].isoformat()
    return report

async def save_file(file: UploadFile) -> dict:
    filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
    file_location = os.path.join(UPLOAD_DIR, filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {
        "type": file.content_type.split("/")[0],  # "image", "video", etc.
        "url": f"/evidence/{filename}",
        "description": None
    }

def get_coordinates(city: str, country: str) -> List[float]:
    try:
        geolocator = Nominatim(user_agent="geoapi")
        location = geolocator.geocode(f"{city}, {country}")
        if location:
            return [location.longitude, location.latitude]
    except:
        pass
    return [0.0, 0.0]

async def create_report_with_files(report_data: dict, files: Optional[List[UploadFile]] = None):
    # ✅ 1. Validate violation types
    for v in report_data["incident_details"]["violation_types"]:
        if v not in allowed_violations:
            raise HTTPException(status_code=400, detail=f"Invalid violation: {v}")

    # ✅ 2. Get coordinates
    city = report_data["incident_details"]["location"]["city"]
    country = report_data["incident_details"]["location"]["country"]
    coords = get_coordinates(city, country)
    report_data["incident_details"]["location"]["coordinates"] = {
        "type": "Point",
        "coordinates": coords
    }

    # ✅ 3. Add system-generated fields
    report_id_suffix = str(ObjectId())[-4:]
    report_data["report_id"] = f"IR-{datetime.utcnow().year}-{report_id_suffix}"
    report_data["created_at"] = datetime.utcnow()
    report_data["assigned_to"] = None
    report_data["status"] = "new"

    # ✅ 4. Save files to evidence
    evidence_list = []
    if files:
        for file in files:
            saved_file = await save_file(file)
            evidence_list.append(saved_file)
    report_data["evidence"] = evidence_list

    # ✅ 5. Save report
    result = await incident_collection.insert_one(report_data)
    new_report = await incident_collection.find_one({"_id": result.inserted_id})
    return serialize_report(new_report)

async def list_reports(status: Optional[str] = None, date_from: Optional[str] = None, date_to: Optional[str] = None, city: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    if city:
        query["incident_details.location.city"] = city
    if date_from or date_to:
        date_query = {}
        if date_from:
            date_query["$gte"] = datetime.fromisoformat(date_from)
        if date_to:
            date_query["$lte"] = datetime.fromisoformat(date_to)
        query["incident_details.date"] = date_query

    reports = []
    cursor = incident_collection.find(query)
    async for doc in cursor:
        reports.append(serialize_report(doc))
    return reports


    cursor = incident_collection.find(query)
    return [serialize_report(doc async for doc in cursor)]

async def update_status(report_id: str, status: str):
    if status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid status value.")
    updated = await incident_collection.update_one({"_id": ObjectId(report_id)}, {"$set": {"status": status}})
    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    report = await incident_collection.find_one({"_id": ObjectId(report_id)})
    return serialize_report(report)

async def analytics_by_violation():
    pipeline = [
        {"$unwind": "$incident_details.violation_types"},
        {"$group": {"_id": "$incident_details.violation_types", "count": {"$sum": 1}}}
    ]
    result = await incident_collection.aggregate(pipeline).to_list(length=None)
    return {doc["_id"]: doc["count"] for doc in result}
