from fastapi import APIRouter
from app.models.caseModel import CaseCreate
from app.controllers.caseController import create_case_controller, get_case_by_id_controller

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.post("/")
async def create_case(case: CaseCreate):
    return await create_case_controller(case)

@router.get("/{case_id}")
def get_case(case_id: str):
    return get_case_by_id_controller(case_id)

