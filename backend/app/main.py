from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, users, jobs, resume, dashboard, ai

# Creates tables on startup if they don't exist yet (SQLite-friendly).
# For PostgreSQL in production, prefer Alembic migrations instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HireIQ API",
    description="AI-Powered Career Intelligence & Job Matching Platform — backend API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(resume.router)
app.include_router(dashboard.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"message": "HireIQ API is running. Visit /docs for interactive API documentation."}
