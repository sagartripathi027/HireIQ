from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.routers.jobs import _serialize_job
from app.routers.users import _get_or_create_profile
from app.services.career_service import compute_skill_gaps
from app.services.matching_service import compute_overall_career_match

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def _time_ago(dt) -> str:
    import datetime
    delta = datetime.datetime.utcnow() - dt
    seconds = delta.total_seconds()
    if seconds < 3600:
        mins = max(1, int(seconds // 60))
        return f"{mins} minute{'s' if mins != 1 else ''} ago"
    if seconds < 86400:
        hours = int(seconds // 3600)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = int(seconds // 86400)
    return f"{days} day{'s' if days != 1 else ''} ago"


@router.get("", response_model=schemas.DashboardOut)
def get_dashboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user)
    profile_skills = [s.name for s in profile.skills]

    all_jobs = db.query(models.Job).all()
    all_job_skill_lists = [[s.name for s in j.skills] for j in all_jobs]
    career_match = compute_overall_career_match(profile_skills, all_job_skill_lists)

    applications = db.query(models.JobApplication).filter(models.JobApplication.user_id == current_user.id).all()
    saved = db.query(models.SavedJob).filter(models.SavedJob.user_id == current_user.id).all()

    saved_ids = {s.job_id for s in saved}
    applied_ids = {a.job_id for a in applications}

    recommended = sorted(
        [_serialize_job(j, profile_skills, saved_ids, applied_ids) for j in all_jobs],
        key=lambda j: j.match,
        reverse=True,
    )[:4]

    gaps = compute_skill_gaps(profile_skills, profile.target_role)

    activity = (
        db.query(models.ActivityLog)
        .filter(models.ActivityLog.user_id == current_user.id)
        .order_by(models.ActivityLog.created_at.desc())
        .limit(5)
        .all()
    )

    return schemas.DashboardOut(
        profileCompletion=profile.profile_completion,
        resumeScore=profile.resume_score,
        careerMatch=career_match,
        totalApplications=len(applications),
        savedJobsCount=len(saved),
        interviews=len([a for a in applications if a.status == "Interview"]),
        rejections=len([a for a in applications if a.status == "Rejected"]),
        recommendedJobs=recommended,
        skillGaps=gaps,
        recentActivity=[schemas.ActivityItem(text=a.text, time=_time_ago(a.created_at)) for a in activity],
    )
