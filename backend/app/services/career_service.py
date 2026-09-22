"""
Career intelligence service — skill-gap analysis feeding the "Gaps for
your target role" panel on dashboard.html.

FUTURE: swap the rule-based diff for a call to an LLM that reasons about
role requirements beyond a static skill list.
"""

# Minimal role -> expected-skills map. Extend as more roles/jobs are added.
ROLE_SKILL_REQUIREMENTS: dict[str, list[str]] = {
    "frontend developer": ["JavaScript", "CSS", "React", "TypeScript", "Testing (Jest)"],
    "backend engineer": ["Python", "SQL", "FastAPI", "System Design", "Docker"],
    "backend engineer (python)": ["Python", "SQL", "FastAPI", "System Design", "Docker"],
    "full-stack developer": ["JavaScript", "Node.js", "SQL", "React", "System Design"],
    "data analyst": ["SQL", "Python", "Excel"],
    "ui/ux designer": ["Figma", "CSS", "Prototyping"],
    "devops engineer": ["AWS", "Docker", "CI/CD", "Kubernetes"],
}

DEFAULT_GAPS = ["TypeScript", "Testing (Jest)", "System Design"]


def compute_skill_gaps(profile_skills: list[str], target_role: str | None) -> list[str]:
    profile_set = {s.lower() for s in profile_skills}
    role_key = (target_role or "").strip().lower()
    required = ROLE_SKILL_REQUIREMENTS.get(role_key, DEFAULT_GAPS)
    gaps = [s for s in required if s.lower() not in profile_set]
    return gaps[:5]
