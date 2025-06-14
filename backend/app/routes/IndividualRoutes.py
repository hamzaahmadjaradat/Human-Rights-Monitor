from fastapi import APIRouter
from app.controllers.IndividualController import (
    get_all_victims_controller,
    create_individual_controller,get_victim_by_id_controller
)
from app.models.individualsModel import IndividualCreate
from fastapi import Body

router = APIRouter(prefix="/individuals", tags=["Individuals"])

@router.get("/victims")
def get_all_victims():
    return get_all_victims_controller()

@router.post("/")
def create_individual(individual: IndividualCreate = Body(...)):
    return create_individual_controller(individual.dict())

@router.get("/victims/{victim_id}")
def get_victim_by_id(victim_id: str):
    victim = get_victim_by_id_controller(victim_id)
    if not victim:
        raise HTTPException(status_code=404, detail="Victim not found")
    return victim
