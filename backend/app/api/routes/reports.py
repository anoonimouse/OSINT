from datetime import date

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ...db.models import Incident
from ...db.session import SessionLocal


router = APIRouter()


class ReportResponse(BaseModel):
    date: str
    summary_text: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate", response_model=ReportResponse)
def generate_daily_report(db: Session = Depends(get_db)):
    today = date.today()
    high_risk = (
        db.query(Incident)
        .filter(Incident.threat_score >= 8)
        .order_by(Incident.timestamp.desc())
        .limit(5)
        .all()
    )

    lines = [f"Daily Internal Security Summary\n\nDate: {today.isoformat()}\n"]
    if high_risk:
        lines.append("High Priority Incidents:")
        for inc in high_risk:
            loc = inc.location or "Unknown location"
            lines.append(f"- [{inc.category}] {loc} (Score: {inc.threat_score:.1f})")
    else:
        lines.append("No high-priority incidents detected today.")

    lines.append("\nAssessment:\nPreliminary automated assessment based on open sources.")

    return ReportResponse(date=today.isoformat(), summary_text="\n".join(lines))

