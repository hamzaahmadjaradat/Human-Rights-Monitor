from fastapi import APIRouter
from app.models.caseModel import CaseCreate
from app.models.caseModel import CaseStatusUpdate
from app.controllers.caseController import (
    create_case_controller,
    get_case_by_id_controller,
    update_case_status_controller,
    list_cases_controller ,
    archive_case_controller
)
from typing import  Optional

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.post("/")
async def create_case(case: CaseCreate):
    return await create_case_controller(case)

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

