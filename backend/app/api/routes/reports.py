from datetime import date, datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ...db.models import Incident
from ...db.session import SessionLocal


router = APIRouter()


class HighRiskIncident(BaseModel):
    id: int
    category: str
    location: str | None
    threat_score: float
    timestamp: datetime

    class Config:
        from_attributes = True


class ReportResponse(BaseModel):
    date: str
    summary_text: str
    high_risk_incidents: List[HighRiskIncident]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate", response_model=ReportResponse)
def generate_daily_report(db: Session = Depends(get_db)):
    today = date.today()
    since = datetime.utcnow() - timedelta(days=1)

    high_risk = (
        db.query(Incident)
        .filter(Incident.threat_score >= 8, Incident.timestamp >= since)
        .order_by(Incident.threat_score.desc(), Incident.timestamp.desc())
        .limit(10)
        .all()
    )

    lines = [f"Daily Internal Security Summary\n\nDate: {today.isoformat()}\n"]
    if high_risk:
        lines.append("High Priority Incidents (last 24h):")
        for inc in high_risk:
            loc = inc.location or "Unknown location"
            lines.append(
                f"- [{inc.category}] {loc} at {inc.timestamp.isoformat()} "
                f"(Score: {inc.threat_score:.1f})"
            )
        lines.append(
            "\nAssessment:\nElevated risk observed in the last 24 hours based on "
            "automatically detected high-severity incidents."
        )
    else:
        lines.append("No high-priority incidents detected in the last 24 hours.")
        lines.append(
            "\nAssessment:\nNo major high-severity signals detected in the recent period."
        )

    return ReportResponse(
        date=today.isoformat(),
        summary_text="\n".join(lines),
        high_risk_incidents=high_risk,
    )

