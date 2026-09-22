from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


def _get_or_create_profile(db: Session, user: models.User) -> models.Profile:
    if user.profile:
        return user.profile
    profile = models.Profile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def _compute_completion(profile: models.Profile, user: models.User) -> int:
    """Mirrors computeCompletion() in profile.html's inline script exactly,
    so the number the frontend showed pre-save matches what persists."""
    score = 20  # base for having an account
    if user.name and user.name.strip():
        score += 10
    if profile.phone and profile.phone.strip():
        score += 10
    if profile.location and profile.location.strip():
        score += 10
    if len(profile.skills) >= 3:
        score += 15
    if len(profile.education) > 0:
        score += 15
    if len(profile.experience_entries) > 0:
        score += 10
    if profile.target_role and profile.target_role.strip():
        score += 10
    return min(score, 100)


def serialize_profile(profile: models.Profile, user: models.User) -> schemas.ProfileOut:
    return schemas.ProfileOut(
        name=user.name,
        email=user.email,
        phone=profile.phone or "",
        location=profile.location or "",
        bio=profile.bio or "",
        targetRole=profile.target_role or "",
        experience=profile.experience_level or "",
        preferredLocation=profile.preferred_location or "",
        jobTypePref=profile.job_type_pref or "",
        skills=[s.name for s in profile.skills],
        education=[
            schemas.EducationItem(degree=e.degree, school=e.school or "", year=e.year or "")
            for e in profile.education
        ],
        experienceHistory=[
            schemas.ExperienceItem(role=e.role, company=e.company or "", duration=e.duration or "")
            for e in profile.experience_entries
        ],
        resumeScore=profile.resume_score,
        profileCompletion=profile.profile_completion,
    )


@router.get("", response_model=schemas.ProfileOut)
def get_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = _get_or_create_profile(db, current_user)
    return serialize_profile(profile, current_user)


@router.put("", response_model=schemas.ProfileOut)
def update_profile(
    payload: schemas.ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = _get_or_create_profile(db, current_user)

    if payload.name is not None:
        current_user.name = payload.name
    if payload.email is not None:
        current_user.email = payload.email
    if payload.phone is not None:
        profile.phone = payload.phone
    if payload.location is not None:
        profile.location = payload.location
    if payload.bio is not None:
        profile.bio = payload.bio
    if payload.targetRole is not None:
        profile.target_role = payload.targetRole
    if payload.experience is not None:
        profile.experience_level = payload.experience
    if payload.preferredLocation is not None:
        profile.preferred_location = payload.preferredLocation
    if payload.jobTypePref is not None:
        profile.job_type_pref = payload.jobTypePref

    if payload.skills is not None:
        profile.skills.clear()
        for skill_name in payload.skills:
            skill_name = skill_name.strip()
            if not skill_name:
                continue
            skill = db.query(models.Skill).filter(models.Skill.name.ilike(skill_name)).first()
            if not skill:
                skill = models.Skill(name=skill_name)
                db.add(skill)
                db.flush()
            profile.skills.append(skill)

    if payload.education is not None:
        profile.education.clear()
        db.flush()
        for item in payload.education:
            db.add(models.Education(profile_id=profile.id, degree=item.degree, school=item.school, year=item.year))

    if payload.experienceHistory is not None:
        profile.experience_entries.clear()
        db.flush()
        for item in payload.experienceHistory:
            db.add(models.ExperienceEntry(
                profile_id=profile.id, role=item.role, company=item.company, duration=item.duration
            ))

    db.flush()
    # Authoritative recalculation server-side (frontend also computes this
    # client-side before saving, but we don't trust the client value).
    profile.profile_completion = _compute_completion(profile, current_user)

    db.commit()
    db.refresh(profile)
    return serialize_profile(profile, current_user)
