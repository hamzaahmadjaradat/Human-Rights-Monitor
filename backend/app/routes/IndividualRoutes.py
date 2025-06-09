# app/routes/individuals.py
from fastapi import APIRouter
from app.controllers.IndividualController import get_all_victims_controller

router = APIRouter(prefix="/individuals", tags=["Individuals"])

@router.get("/victims")
def get_all_victims():
    return get_all_victims_controller()
