from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.routers.users import _get_or_create_profile
from app.services.matching_service import compute_match_score

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


def _posted_label(job: models.Job) -> str:
    """Reconstructs the "2 days ago" style label jobs.html expects, from
    the stored posted_at timestamp."""
    import datetime
    delta = datetime.datetime.utcnow() - job.posted_at
    days = delta.days
    if days <= 0:
        return "Today"
    if days == 1:
        return "1 day ago"
    if days < 7:
        return f"{days} days ago"
    weeks = days // 7
    return "1 week ago" if weeks == 1 else f"{weeks} weeks ago"


def _serialize_job(job: models.Job, profile_skills: list[str], saved_ids: set[int], applied_ids: set[int]) -> schemas.JobOut:
    job_skill_names = [s.name for s in job.skills]
    return schemas.JobOut(
        id=str(job.id),
        title=job.title,
        company=job.company,
        location=job.location,
        type=job.job_type,
        experience=job.experience_level,
        salary=job.salary or "",
        match=compute_match_score(profile_skills, job_skill_names),
        skills=job_skill_names,
        posted=_posted_label(job),
        saved=job.id in saved_ids,
        applied=job.id in applied_ids,
    )


@router.get("", response_model=list[schemas.JobOut])
def list_jobs(
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    experience: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),  # "match" | "recent"
    limit: Optional[int] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(models.Job)

    if location:
        q = q.filter(models.Job.location == location)
    if experience:
        q = q.filter(models.Job.experience_level == experience)
    if type:
        q = q.filter(models.Job.job_type == type)
    if skill:
        q = q.join(models.Job.skills).filter(models.Skill.name == skill)

    jobs = q.all()

    if query:
        ql = query.lower()
        jobs = [
            j for j in jobs
            if ql in j.title.lower()
            or ql in j.company.lower()
            or any(ql in s.name.lower() for s in j.skills)
        ]

    profile = _get_or_create_profile(db, current_user)
    profile_skills = [s.name for s in profile.skills]

    saved_ids = {sj.job_id for sj in db.query(models.SavedJob).filter(models.SavedJob.user_id == current_user.id)}
    applied_ids = {a.job_id for a in db.query(models.JobApplication).filter(models.JobApplication.user_id == current_user.id)}

    results = [_serialize_job(j, profile_skills, saved_ids, applied_ids) for j in jobs]

    if sort == "match":
        results.sort(key=lambda j: j.match, reverse=True)
    elif sort == "recent":
        # posted_at desc == most recently posted first
        id_order = {str(j.id): j.posted_at for j in jobs}
        results.sort(key=lambda j: id_order[j.id], reverse=True)

    if limit:
        results = results[:limit]

    return results


@router.get("/{job_id}", response_model=schemas.JobOut)
def get_job(job_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    profile = _get_or_create_profile(db, current_user)
    profile_skills = [s.name for s in profile.skills]
    saved_ids = {sj.job_id for sj in db.query(models.SavedJob).filter(models.SavedJob.user_id == current_user.id)}
    applied_ids = {a.job_id for a in db.query(models.JobApplication).filter(models.JobApplication.user_id == current_user.id)}

    return _serialize_job(job, profile_skills, saved_ids, applied_ids)


@router.post("/{job_id}/apply", response_model=schemas.ApplyResponse)
def apply_to_job(job_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    existing = db.query(models.JobApplication).filter(
        models.JobApplication.user_id == current_user.id, models.JobApplication.job_id == job_id
    ).first()
    if existing:
        return schemas.ApplyResponse(success=True, status=existing.status)

    db.add(models.JobApplication(user_id=current_user.id, job_id=job_id))
    db.add(models.ActivityLog(user_id=current_user.id, text=f"Applied to {job.title} at {job.company}"))
    db.commit()
    return schemas.ApplyResponse(success=True, status="Applied")


@router.post("/{job_id}/save", response_model=schemas.SaveResponse)
def save_job(job_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Toggle save/unsave — matches the single saveJob() function in
    app.js which flips state rather than having separate save/unsave
    frontend calls."""
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    existing = db.query(models.SavedJob).filter(
        models.SavedJob.user_id == current_user.id, models.SavedJob.job_id == job_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return schemas.SaveResponse(success=True, saved=False)

    db.add(models.SavedJob(user_id=current_user.id, job_id=job_id))
    db.add(models.ActivityLog(user_id=current_user.id, text=f"Saved {job.title} at {job.company}"))
    db.commit()
    return schemas.SaveResponse(success=True, saved=True)


@router.delete("/{job_id}/save", response_model=schemas.SaveResponse)
def unsave_job(job_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Explicit DELETE variant, provided alongside the toggle POST above
    for REST-conventional clients (the original spec listed both)."""
    existing = db.query(models.SavedJob).filter(
        models.SavedJob.user_id == current_user.id, models.SavedJob.job_id == job_id
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
    return schemas.SaveResponse(success=True, saved=False)
