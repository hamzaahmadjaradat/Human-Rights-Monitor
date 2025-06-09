from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Coordinates(BaseModel):
    type: str = "Point"
    coordinates: List[float]

class Location(BaseModel):
    country: str
    region: str
    coordinates: Coordinates

class Evidence(BaseModel):
    type: str
    url: str
    description: Optional[str]
    date_captured: datetime

class Perpetrator(BaseModel):
    name: str
    type: str

class CaseCreate(BaseModel):
    title: str
    description: str
    violation_types: List[str]
    status: str
    priority: Optional[str]
    location: Location
    date_occurred: datetime
    victims: List[str]
    perpetrators: List[Perpetrator]
    evidence: List[Evidence]
    created_by: str

class CaseStatusUpdate(BaseModel):
    new_status: str
    changed_by: str 
    reason: Optional[str] = None 
    notes: Optional[str] = None 
