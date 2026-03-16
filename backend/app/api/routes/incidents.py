from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.models import Incident
from ...db.session import SessionLocal
from ...schemas.incidents import IncidentBase


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=List[IncidentBase])
def list_incidents(
    db: Session = Depends(get_db),
    type: Optional[str] = None,
    min_score: float = 0.0,
    limit: int = 100,
):
    query = db.query(Incident).filter(Incident.threat_score >= min_score)
    if type:
        query = query.filter(Incident.category == type)
    return query.order_by(Incident.timestamp.desc()).limit(limit).all()

