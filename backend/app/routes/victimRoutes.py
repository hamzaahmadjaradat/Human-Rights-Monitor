from fastapi import APIRouter, Depends
from backend.models.victimModel import VictimCreate, RiskUpdate
from backend.controllers.victimController import (
    add_victim_controller,
    get_victim_controller,
    update_risk_controller,
    list_victims_by_case_controller
)

router = APIRouter(prefix="/victims", tags=["Victims"])

@router.post("/") #POST /victims
def add_victim(data: VictimCreate):
    return add_victim_controller(data)

@router.get("/{victim_id}") #GET /victims by id 
def get_victim(victim_id: str):
    return get_victim_controller(victim_id)

@router.patch("/{victim_id}") #UPDATE /victims
def update_risk(victim_id: str, update: RiskUpdate):
    return update_risk_controller(victim_id, update)

@router.get("/case/{case_id}") #GET /victims case
def list_victims(case_id: str):
    return list_victims_by_case_controller(case_id)
