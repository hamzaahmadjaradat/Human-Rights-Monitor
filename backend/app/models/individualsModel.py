from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class Demographics(BaseModel):
    gender: str
    age: int
    ethnicity: Optional[str]
    occupation: Optional[str]

class ContactInfo(BaseModel):
    email: Optional[EmailStr]
    phone: Optional[str]
    secure_messaging: Optional[str]

class RiskAssessment(BaseModel):
    level: str  # e.g., low, medium, high
    threats: Optional[List[str]] = []
    protection_needed: Optional[bool] = False

class SupportService(BaseModel):
    type: str
    provider: str
    status: Optional[str] = "active"

class IndividualCreate(BaseModel):
    name: str
    type: str = Field(..., pattern="^(victim|witness)$")
    anonymous: bool = False
    demographics: Demographics
    contact_info: Optional[ContactInfo] = None
    cases_involved: Optional[List[str]] = []  
    risk_assessment: Optional[RiskAssessment] = None
    support_services: Optional[List[SupportService]] = []
