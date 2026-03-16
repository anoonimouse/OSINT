from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import incidents, reports, map as map_routes


from .db.session import SessionLocal
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text



app = FastAPI(title="OSINT Threat Monitoring Platform")

# /db route to check database connectivity
@app.get("/db")
def db_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"db": "reachable"}
    except SQLAlchemyError as e:
        return {"db": "unreachable", "error": str(e)}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])
app.include_router(map_routes.router, prefix="/api/map", tags=["map"])
app.include_router(reports.router, prefix="/api/report", tags=["reports"])

