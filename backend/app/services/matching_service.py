"""
Job matching service.

Current implementation: rule-based skill-overlap scoring, matching the
`match` percentage shown on every job card in jobs.html / dashboard.html.

FUTURE: replace `compute_match_score()` with an embedding-similarity or
LLM-based scorer. Callers only ever pass in two skill lists and get an
int back, so the swap is contained entirely to this file.
"""


def compute_match_score(profile_skills: list[str], job_skills: list[str]) -> int:
    """Percentage of the job's required skills the profile already has,
    with a small baseline so a 0-skill overlap doesn't look broken (0%)
    on every card — mirrors the original demo data's spread (58-92%)."""
    if not job_skills:
        return 60

    profile_set = {s.lower() for s in profile_skills}
    job_set = {s.lower() for s in job_skills}
    overlap = len(profile_set & job_set)

    ratio = overlap / len(job_set)
    score = round(35 + ratio * 65)  # baseline 35%, up to 100% on full overlap
    return max(0, min(score, 100))


def compute_overall_career_match(profile_skills: list[str], all_job_skill_lists: list[list[str]]) -> int:
    """Average match score across all active jobs — used for the dashboard's
    'Overall Career Match' stat card."""
    if not all_job_skill_lists:
        return 0
    scores = [compute_match_score(profile_skills, js) for js in all_job_skill_lists]
    return round(sum(scores) / len(scores))
