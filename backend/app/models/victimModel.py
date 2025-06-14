from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VictimCreate(BaseModel):
    case_id: str
    pseudonym: Optional[str]
    full_name: Optional[str]
    contact_info: Optional[str]
    risk_level: str = Field(..., pattern="^(low|medium|high)$")
    added_by: str 

class VictimResponse(BaseModel):
    id: str
    pseudonym: Optional[str]
    risk_level: str
    case_id: str

class RiskUpdate(BaseModel):
    new_risk_level: str = Field(..., pattern="^(low|medium|high)$")
    updated_by: str
