import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------
class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    skills: list[str] = Field(default_factory=list)
    targetRole: str = Field(min_length=1, max_length=120)
    experience: str = Field(min_length=1, max_length=30)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str
    email: EmailStr


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------
class EducationItem(BaseModel):
    degree: str
    school: Optional[str] = ""
    year: Optional[str] = ""


class ExperienceItem(BaseModel):
    role: str
    company: Optional[str] = ""
    duration: Optional[str] = ""


class ProfileUpdate(BaseModel):
    """Matches the fields sent by updateProfile() across signup.html and
    profile.html. All fields optional since callers send partial updates."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    targetRole: Optional[str] = None
    experience: Optional[str] = None
    preferredLocation: Optional[str] = None
    jobTypePref: Optional[str] = None
    skills: Optional[list[str]] = None
    education: Optional[list[EducationItem]] = None
    experienceHistory: Optional[list[ExperienceItem]] = None
    profileCompletion: Optional[int] = None  # frontend computes this client-side today;
    # backend recalculates authoritatively regardless of what's sent (see profile_service)


class ProfileOut(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    location: Optional[str] = ""
    bio: Optional[str] = ""
    targetRole: Optional[str] = ""
    experience: Optional[str] = ""
    preferredLocation: Optional[str] = ""
    jobTypePref: Optional[str] = ""
    skills: list[str] = []
    education: list[EducationItem] = []
    experienceHistory: list[ExperienceItem] = []
    resumeScore: int = 0
    profileCompletion: int = 20


# ---------------------------------------------------------------------
# Jobs
# ---------------------------------------------------------------------
class JobOut(BaseModel):
    id: str
    title: str
    company: str
    location: str
    type: str
    experience: str
    salary: Optional[str] = ""
    match: int
    skills: list[str]
    posted: str
    saved: bool = False
    applied: bool = False


class ApplyResponse(BaseModel):
    success: bool = True
    status: str = "Applied"


class SaveResponse(BaseModel):
    success: bool = True
    saved: bool


# ---------------------------------------------------------------------
# Resume
# ---------------------------------------------------------------------
class ResumeAnalysisOut(BaseModel):
    score: int
    extractedSkills: list[str]
    strengths: list[str]
    missingSkills: list[str]
    recommendations: list[str]


# ---------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------
class ActivityItem(BaseModel):
    text: str
    time: str


class DashboardOut(BaseModel):
    profileCompletion: int
    resumeScore: int
    careerMatch: int
    totalApplications: int
    savedJobsCount: int
    interviews: int
    rejections: int
    recommendedJobs: list[JobOut]
    skillGaps: list[str]
    recentActivity: list[ActivityItem]


class SkillGapsOut(BaseModel):
    targetRole: str
    yourSkills: list[str]
    gaps: list[str]
