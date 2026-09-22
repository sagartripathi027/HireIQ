"""
Seeds the database with:
  1. The same 8 jobs that were hardcoded as DEMO_JOBS in the original
     frontend app.js, so jobs.html/dashboard.html show identical data
     to what the prototype demoed.
  2. The demo login (demo@hireiq.io / demo1234) referenced directly in
     login.html's hint text, so that credential continues to work.

Run with:  python seed.py
"""
from app.database import SessionLocal, Base, engine
from app import models
from app.security import hash_password

Base.metadata.create_all(bind=engine)

DEMO_JOBS = [
    {"title": "Frontend Developer", "company": "Nimbus Labs", "location": "Bengaluru", "job_type": "Full-time",
     "experience_level": "1-3 yrs", "salary": "₹8L - ₹14L", "skills": ["JavaScript", "CSS", "React"]},
    {"title": "Backend Engineer (Python)", "company": "Orbital Systems", "location": "Remote", "job_type": "Full-time",
     "experience_level": "2-4 yrs", "salary": "₹12L - ₹18L", "skills": ["Python", "FastAPI", "SQL"]},
    {"title": "Full-Stack Developer", "company": "Lightpath Tech", "location": "Pune", "job_type": "Full-time",
     "experience_level": "0-2 yrs", "salary": "₹6L - ₹10L", "skills": ["JavaScript", "Node.js", "MongoDB"]},
    {"title": "Data Analyst", "company": "Vertex Analytics", "location": "Hyderabad", "job_type": "Full-time",
     "experience_level": "1-3 yrs", "salary": "₹7L - ₹11L", "skills": ["SQL", "Python", "Excel"]},
    {"title": "UI/UX Designer", "company": "Studio North", "location": "Remote", "job_type": "Contract",
     "experience_level": "2-5 yrs", "salary": "₹9L - ₹15L", "skills": ["Figma", "CSS", "Prototyping"]},
    {"title": "Junior Software Engineer", "company": "Cobalt Software", "location": "Chennai", "job_type": "Full-time",
     "experience_level": "0-1 yrs", "salary": "₹4.5L - ₹7L", "skills": ["Java", "SQL", "Git"]},
    {"title": "DevOps Engineer", "company": "Ironclad Cloud", "location": "Bengaluru", "job_type": "Full-time",
     "experience_level": "2-4 yrs", "salary": "₹14L - ₹20L", "skills": ["AWS", "Docker", "CI/CD"]},
    {"title": "React Native Developer", "company": "Pixel Forge", "location": "Remote", "job_type": "Internship",
     "experience_level": "0-1 yrs", "salary": "₹25K/mo", "skills": ["React Native", "JavaScript"]},
]


def get_or_create_skill(db, name):
    skill = db.query(models.Skill).filter(models.Skill.name == name).first()
    if not skill:
        skill = models.Skill(name=name)
        db.add(skill)
        db.flush()
    return skill


def seed():
    db = SessionLocal()
    try:
        if db.query(models.Job).count() == 0:
            for j in DEMO_JOBS:
                job = models.Job(
                    title=j["title"], company=j["company"], location=j["location"],
                    job_type=j["job_type"], experience_level=j["experience_level"], salary=j["salary"],
                )
                db.add(job)
                db.flush()
                for skill_name in j["skills"]:
                    job.skills.append(get_or_create_skill(db, skill_name))
            print(f"Seeded {len(DEMO_JOBS)} jobs.")
        else:
            print("Jobs already seeded, skipping.")

        demo_email = "demo@hireiq.io"
        if not db.query(models.User).filter(models.User.email == demo_email).first():
            user = models.User(name="Demo User", email=demo_email, hashed_password=hash_password("demo1234"))
            db.add(user)
            db.flush()
            profile = models.Profile(
                user_id=user.id, target_role="Frontend Developer", experience_level="1-3 yrs",
                location="Bengaluru", profile_completion=55,
            )
            db.add(profile)
            db.flush()
            for skill_name in ["JavaScript", "CSS", "HTML", "Git"]:
                profile.skills.append(get_or_create_skill(db, skill_name))
            db.add(models.Education(profile_id=profile.id, degree="B.Tech, Computer Science",
                                     school="IET, DAVV Indore", year="2021 - 2025"))
            db.add(models.ActivityLog(user_id=user.id, text="Account created"))
            print(f"Seeded demo user: {demo_email} / demo1234")
        else:
            print("Demo user already exists, skipping.")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
