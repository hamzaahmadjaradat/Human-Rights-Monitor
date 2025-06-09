from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional, List
from app.controllers.caseController import (
    create_case_controller,
    get_case_by_id_controller,
    update_case_status_controller,
    list_cases_controller,
    archive_case_controller
)
from app.models.caseModel import  CaseStatusUpdate

import json

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.post("/")
async def create_case(
    title: str = Form(...),
    description: str = Form(...),
    violation_types: str = Form(...), 
    status: str = Form(...),
    priority: Optional[str] = Form(None),
    location: str = Form(...),  
    date_occurred: str = Form(...),
    date_reported: str = Form(...),
    victims: Optional[str] = Form(None),  
    perpetrators: Optional[str] = Form(None),  
    created_by: str = Form(...),
    evidence_description: Optional[str] = Form(None),
    evidence_date: Optional[str] = Form(None),
    case_id: Optional[str] = Form(None),
    evidence_files: Optional[List[UploadFile]] = File(None)
):
    return await create_case_controller(
        title, description, violation_types, status, priority,
        location, date_occurred, date_reported,
        victims, perpetrators, created_by,
        evidence_description, evidence_date, case_id, evidence_files
    )


@router.get("/{case_id}")
def get_case(case_id: str):
    return get_case_by_id_controller(case_id)

@router.patch("/{case_id}")
def update_case_status(case_id: str, update_data: CaseStatusUpdate):
    return update_case_status_controller(case_id, update_data)

@router.get("/")
def list_cases(
    region: Optional[str] = None,
    violation: Optional[str] = None,
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    page: int = 1,
    limit: int = 10
):
    return list_cases_controller(region, violation, status, date_from, date_to, page, limit)

@router.delete("/{case_id}")
def archive_case(case_id: str):
    return archive_case_controller(case_id)
