from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ...db.session import SessionLocal
from ...collector.pipeline import run_collection_cycle
import os

router = APIRouter()

# Set your admin password here or use an environment variable for better security
ADMIN_PASSWORD = os.getenv("COLLECTOR_ADMIN_PASSWORD", "changeme123")

# Dependency to get DB session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/run")
def run_collector(request: Request, db: Session = Depends(get_db)):
    data = None
    try:
        data = await request.json()
    except Exception:
        pass
    password = (data or {}).get("password") if data else None
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    stats = run_collection_cycle(db)
    return {"status": "ok", **stats}
