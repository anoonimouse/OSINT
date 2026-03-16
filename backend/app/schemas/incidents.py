from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class IncidentBase(BaseModel):
    id: int
    article_id: int
    category: str
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    threat_score: float
    entities: Dict[str, Any]
    summary: Optional[str]
    timestamp: datetime

    class Config:
        orm_mode = True

