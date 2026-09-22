from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from app.security import hash_password, verify_password, create_access_token


router = APIRouter(prefix="/api/auth", tags=["auth"])


# ============================================================
# REGISTER
# ============================================================

@router.post(
    "/register",
    response_model=schemas.Token,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: schemas.RegisterRequest,
    db: Session = Depends(get_db),
):
    # Check if email already exists
    existing = (
        db.query(models.User)
        .filter(models.User.email == payload.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists.",
        )

    # Create user
    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )

    db.add(user)
    db.flush()

    # Create profile
    profile = models.Profile(
        user_id=user.id,
        target_role=payload.targetRole,
        experience_level=payload.experience,
        profile_completion=65,
    )

    db.add(profile)
    db.flush()

    # Add skills
    for skill_name in payload.skills:
        skill_name = skill_name.strip()

        if not skill_name:
            continue

        skill = (
            db.query(models.Skill)
            .filter(models.Skill.name.ilike(skill_name))
            .first()
        )

        if not skill:
            skill = models.Skill(name=skill_name)
            db.add(skill)
            db.flush()

        profile.skills.append(skill)

    # Activity
    db.add(
        models.ActivityLog(
            user_id=user.id,
            text="Account created",
        )
    )

    db.commit()

    # Create JWT
    token = create_access_token(subject=user.email)

    return schemas.Token(
        access_token=token,
        name=user.name,
        email=user.email,
    )


# ============================================================
# NORMAL LOGIN
# JSON BODY
# ============================================================

@router.post(
    "/login",
    response_model=schemas.Token,
)
def login(
    payload: schemas.LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.email == payload.email)
        .first()
    )

    if not user or not verify_password(
        payload.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject=user.email)

    return schemas.Token(
        access_token=token,
        name=user.name,
        email=user.email,
    )


# ============================================================
# SWAGGER LOGIN
# OAuth2 FORM
# Used by /docs -> Authorize
# ============================================================

@router.post(
    "/token",
    include_in_schema=True,
)
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.email == form_data.username)
        .first()
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject=user.email)

    return {
        "access_token": token,
        "token_type": "bearer",
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get(
    "/me",
    response_model=schemas.UserOut,
)
def get_me(
    current_user: models.User = Depends(get_current_user),
):
    return current_user