import json
import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app import models, schemas
from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.routers.users import _get_or_create_profile
from app.services.resume_service import extract_text, analyze_resume_text

router = APIRouter(prefix="/api/resume", tags=["resume"])

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


def _analysis_to_schema(analysis: models.ResumeAnalysis) -> schemas.ResumeAnalysisOut:
    return schemas.ResumeAnalysisOut(
        score=analysis.score,
        extractedSkills=json.loads(analysis.extracted_skills),
        strengths=json.loads(analysis.strengths),
        missingSkills=json.loads(analysis.missing_skills),
        recommendations=json.loads(analysis.recommendations),
    )


@router.post("/upload", response_model=schemas.ResumeAnalysisOut)
async def upload_resume(
    resume: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # --- Validate file type (matches resume.html's client-side check: .pdf/.doc/.docx) ---
    ext = resume.filename.rsplit(".", 1)[-1].lower() if "." in resume.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Please upload a PDF or DOCX file.")

    file_bytes = await resume.read()

    # --- Validate size (matches resume.html's 5MB client-side check) ---
    max_bytes = settings.max_resume_size_mb * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File is too large. Max size is {settings.max_resume_size_mb}MB.")

    # --- Store file safely: random filename on disk, never trust the original name for the path ---
    os.makedirs(settings.upload_dir, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}.{ext}"
    stored_path = os.path.join(settings.upload_dir, stored_name)
    with open(stored_path, "wb") as f:
        f.write(file_bytes)

    extracted_text = extract_text(file_bytes, ext)

    profile = _get_or_create_profile(db, current_user)

    db_resume = models.Resume(
        user_id=current_user.id,
        original_filename=resume.filename,
        stored_path=stored_path,
        file_type=ext,
        size_bytes=len(file_bytes),
        extracted_text=extracted_text,
    )
    db.add(db_resume)
    db.flush()

    result = analyze_resume_text(extracted_text, target_role=profile.target_role)

    db_analysis = models.ResumeAnalysis(
        resume_id=db_resume.id,
        score=result["score"],
        extracted_skills=json.dumps(result["extractedSkills"]),
        strengths=json.dumps(result["strengths"]),
        missing_skills=json.dumps(result["missingSkills"]),
        recommendations=json.dumps(result["recommendations"]),
    )
    db.add(db_analysis)

    profile.resume_score = result["score"]
    db.add(models.ActivityLog(user_id=current_user.id, text=f"Resume analyzed — score {result['score']}/100"))

    db.commit()
    return schemas.ResumeAnalysisOut(**result)


@router.get("", response_model=list[dict])
def list_resumes(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.uploaded_at.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.original_filename,
            "fileType": r.file_type,
            "sizeBytes": r.size_bytes,
            "uploadedAt": r.uploaded_at.isoformat(),
        }
        for r in resumes
    ]


@router.get("/analysis", response_model=schemas.ResumeAnalysisOut)
def get_latest_analysis(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.uploaded_at.desc())
        .first()
    )
    if not resume or not resume.analysis:
        raise HTTPException(status_code=404, detail="No resume analysis found yet. Upload a resume first.")
    return _analysis_to_schema(resume.analysis)
