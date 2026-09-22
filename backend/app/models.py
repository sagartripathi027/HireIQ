import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship

from app.database import Base


# ---------------------------------------------------------------------
# Association tables (many-to-many)
# ---------------------------------------------------------------------
profile_skills = Table(
    "profile_skills", Base.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

job_skills = Table(
    "job_skills", Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)


# ---------------------------------------------------------------------
# Core entities
# ---------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(190), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    activity = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")


class Skill(Base):
    """Master skill list — shared between profiles and job postings so
    filters (jobs.html skillFilter) and matching logic compare on the
    same normalized values."""
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Personal Info tab
    phone = Column(String(30), nullable=True)
    location = Column(String(120), nullable=True)
    bio = Column(Text, nullable=True)

    # Career Preferences tab
    target_role = Column(String(120), nullable=True)
    experience_level = Column(String(30), nullable=True)  # Fresher / 0-1 yrs / 1-3 yrs / etc.
    preferred_location = Column(String(120), nullable=True)
    job_type_pref = Column(String(30), nullable=True)  # Full-time / Contract / Internship / Remote only

    # Derived / stored scores shown on dashboard
    resume_score = Column(Integer, default=0)
    profile_completion = Column(Integer, default=20)  # base score for having an account

    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")
    skills = relationship("Skill", secondary=profile_skills, backref="profiles")
    education = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    experience_entries = relationship("ExperienceEntry", back_populates="profile", cascade="all, delete-orphan")


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    degree = Column(String(160), nullable=False)
    school = Column(String(160), nullable=True)
    year = Column(String(40), nullable=True)  # free text, e.g. "2021 - 2025" to match frontend

    profile = relationship("Profile", back_populates="education")


class ExperienceEntry(Base):
    __tablename__ = "experience_entries"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(160), nullable=False)
    company = Column(String(160), nullable=True)
    duration = Column(String(60), nullable=True)  # free text, e.g. "Jun 2023 - Present"

    profile = relationship("Profile", back_populates="experience_entries")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(160), nullable=False)
    company = Column(String(160), nullable=False)
    location = Column(String(120), nullable=False)
    job_type = Column(String(30), nullable=False)          # Full-time / Contract / Internship
    experience_level = Column(String(30), nullable=False)  # e.g. "1-3 yrs"
    salary = Column(String(60), nullable=True)
    posted_at = Column(DateTime, default=datetime.datetime.utcnow)
    description = Column(Text, nullable=True)

    skills = relationship("Skill", secondary=job_skills, backref="jobs")
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")


class SavedJob(Base):
    __tablename__ = "saved_jobs"
    __table_args__ = (UniqueConstraint("user_id", "job_id", name="uq_user_saved_job"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")


class JobApplication(Base):
    __tablename__ = "job_applications"
    __table_args__ = (UniqueConstraint("user_id", "job_id", name="uq_user_job_application"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="Applied")  # Applied / Interview / Rejected / Offer
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    stored_path = Column(String(500), nullable=False)
    file_type = Column(String(10), nullable=False)  # pdf / doc / docx
    size_bytes = Column(Integer, nullable=False)
    extracted_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    score = Column(Integer, nullable=False)
    extracted_skills = Column(Text, nullable=False)   # JSON-encoded list[str]
    strengths = Column(Text, nullable=False)          # JSON-encoded list[str]
    missing_skills = Column(Text, nullable=False)     # JSON-encoded list[str]
    recommendations = Column(Text, nullable=False)    # JSON-encoded list[str]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis")


class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    text = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="activity")
