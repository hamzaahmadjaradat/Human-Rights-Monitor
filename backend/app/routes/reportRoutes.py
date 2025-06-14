<<<<<<< HEAD
from fastapi import APIRouter, UploadFile, File, Form, Query
from typing import List, Optional
from fastapi.responses import JSONResponse
import json

from app.controllers.reportController import (
    create_report_with_files,
    list_reports,
    update_status,
    analytics_by_violation,
)

router = APIRouter()

@router.post("/", response_model=dict)
async def create_report(
    reporter_type: str = Form(...),
    anonymous: bool = Form(True),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    preferred_contact: Optional[str] = Form(None),
    date: str = Form(...),
    country: str = Form(...),
    city: str = Form(...),
    description: str = Form(...),
    violation_types: str = Form(...),
    coordinates: str = Form(...),  # ✅ أضف هذا السطر المهم
    files: Optional[List[UploadFile]] = File(None),
):
    violation_list = [v.strip() for v in violation_types.split(",") if v.strip()]
    report_data = {
        "reporter_type": reporter_type,
        "anonymous": anonymous,
        "contact_info": {
            "email": email,
            "phone": phone,
            "preferred_contact": preferred_contact,
        },
        "incident_details": {
            "date": date,
            "location": {
                "country": country,
                "city": city,
                "coordinates": json.loads(coordinates)
            },
            "description": description,
            "violation_types": violation_list,
        },
        "status": "new",
    }
    result = await create_report_with_files(report_data, files)
    return JSONResponse(content=result)

@router.get("/", response_model=list)
async def get_reports(
    status: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
):
    return await list_reports(status=status, date_from=date_from, date_to=date_to, city=city)

@router.patch("/{report_id}", response_model=dict)
async def update_report_status(report_id: str, status: str):
    return await update_status(report_id, status)

@router.get("/analytics", response_model=dict)
async def get_analytics():
    return await analytics_by_violation()
=======
from fastapi import APIRouter, UploadFile, File, Form, Query
from typing import List, Optional
from fastapi.responses import JSONResponse
import json

from app.controllers.reportController import (
    create_report_with_files,
    list_reports,
    update_status,
    analytics_by_violation,
)

router = APIRouter()

@router.post("/", response_model=dict)
def create_report(
    reporter_type: str = Form(...),
    anonymous: bool = Form(True),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    preferred_contact: Optional[str] = Form(None),
    date: str = Form(...),
    country: str = Form(...),
    city: str = Form(...),
    description: str = Form(...),
    violation_types: str = Form(...),
    coordinates: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
):
    violation_list = [v.strip() for v in violation_types.split(",") if v.strip()]
    report_data = {
        "reporter_type": reporter_type,
        "anonymous": anonymous,
        "contact_info": {
            "email": email,
            "phone": phone,
            "preferred_contact": preferred_contact,
        },
        "incident_details": {
            "date": date,
            "location": {
                "country": country,
                "city": city,
                "coordinates": json.loads(coordinates)
            },
            "description": description,
            "violation_types": violation_list,
        },
        "status": "new",
    }
    result = create_report_with_files(report_data, files)
    return JSONResponse(content=result)

@router.get("/", response_model=list)
def get_reports(
    status: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
):
    return list_reports(status=status, date_from=date_from, date_to=date_to, city=city)

@router.patch("/{report_id}", response_model=dict)
def update_report_status(report_id: str, status: str):
    return update_status(report_id, status)

@router.get("/analytics", response_model=dict)
def get_analytics():
    return analytics_by_violation()
>>>>>>> 418cd1b0 (update the README file and change the location add to be by a map)
