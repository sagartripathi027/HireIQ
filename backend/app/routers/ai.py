from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.routers.jobs import _serialize_job
from app.routers.users import _get_or_create_profile
from app.services.career_service import compute_skill_gaps

router = APIRouter(prefix="/api", tags=["ai"])


@router.get("/recommendations", response_model=list[schemas.JobOut])
def get_recommendations(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user)
    profile_skills = [s.name for s in profile.skills]

    all_jobs = db.query(models.Job).all()
    saved_ids = {s.job_id for s in db.query(models.SavedJob).filter(models.SavedJob.user_id == current_user.id)}
    applied_ids = {a.job_id for a in db.query(models.JobApplication).filter(models.JobApplication.user_id == current_user.id)}

    results = sorted(
        [_serialize_job(j, profile_skills, saved_ids, applied_ids) for j in all_jobs],
        key=lambda j: j.match,
        reverse=True,
    )
    return results[:6]


@router.get("/skill-gaps", response_model=schemas.SkillGapsOut)
def get_skill_gaps(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user)
    profile_skills = [s.name for s in profile.skills]
    gaps = compute_skill_gaps(profile_skills, profile.target_role)
    return schemas.SkillGapsOut(targetRole=profile.target_role or "", yourSkills=profile_skills, gaps=gaps)
