from typing import List

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
def map_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).filter(Incident.latitude.isnot(None)).all()

