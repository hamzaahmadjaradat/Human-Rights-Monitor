from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class ContactInfo(BaseModel):
    email: Optional[EmailStr]
    phone: Optional[str]
    preferred_contact: Optional[str]

class Coordinates(BaseModel):
    type: str = "Point"
    coordinates: List[float]

class Location(BaseModel):
    country: str
    city: str
    coordinates: Coordinates

class IncidentDetails(BaseModel):
    date: datetime
    location: Location
    description: str
    violation_types: List[str]

class ReportCreate(BaseModel):
    reporter_type: str
    anonymous: bool = True
    contact_info: Optional[ContactInfo]
    incident_details: IncidentDetails
    status: str = "new"

class ReportInDB(ReportCreate):
    created_at: datetime = Field(default_factory=datetime.utcnow)
