from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import incidents, reports, map as map_routes


app = FastAPI(title="OSINT Threat Monitoring Platform")


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

