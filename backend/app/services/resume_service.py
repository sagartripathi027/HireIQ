"""
Resume analysis service.

Current implementation: rule-based keyword extraction + heuristic scoring,
matching the shape the frontend already expects (see uploadResume() in
app.js — score, extractedSkills, strengths, missingSkills, recommendations).

FUTURE: swap `extract_text()` for a real PDF/DOCX parser (pdfplumber,
python-docx) and swap `analyze_resume_text()` for a call to an LLM
provider. Nothing outside this file needs to change — routers/resume.py
only calls the two functions below.
"""
import re
from typing import BinaryIO

# Master skill vocabulary the rule-based extractor looks for.
# Mirrors the DEMO_JOBS skill set in the original frontend app.js plus
# common adjacent skills, so extraction lines up with real job postings.
KNOWN_SKILLS = [
    "JavaScript", "TypeScript", "Python", "Java", "SQL", "HTML", "CSS",
    "React", "React Native", "Node.js", "MongoDB", "FastAPI", "Django",
    "Flask", "AWS", "Docker", "CI/CD", "Git", "Figma", "Excel",
    "Prototyping", "REST APIs", "GraphQL", "Testing (Jest)", "Jest",
    "System Design", "Kubernetes", "PostgreSQL", "Redis",
]


def extract_text(file_bytes: bytes, file_type: str) -> str:
    """Extract raw text from an uploaded resume file.

    Dispatches to the appropriate parser based on file_type:
      pdf  → pdfplumber  (handles text-layer PDFs)
      docx → python-docx (paragraph + table text)
      doc / txt / other → UTF-8 decode fallback
    Returns an empty string if extraction fails entirely.
    """
    ft = file_type.lower().lstrip(".")

    if ft == "pdf":
        try:
            import io
            import pdfplumber
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                pages = [page.extract_text() or "" for page in pdf.pages]
            return "\n".join(pages).strip()
        except Exception:
            return ""

    if ft == "docx":
        try:
            import io
            from docx import Document
            doc = Document(io.BytesIO(file_bytes))
            parts: list[str] = []
            for para in doc.paragraphs:
                if para.text.strip():
                    parts.append(para.text)
            # Also pull text from tables
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        if cell.text.strip():
                            parts.append(cell.text)
            return "\n".join(parts).strip()
        except Exception:
            return ""

    # Plain-text fallback for .txt, legacy .doc (pre-2007 binary), etc.
    try:
        return file_bytes.decode("utf-8", errors="ignore").strip()
    except Exception:
        return ""



def analyze_resume_text(text: str, target_role: str | None = None) -> dict:
    """Rule-based resume analysis. Returns the exact shape the frontend
    resume.html page renders (score / extractedSkills / strengths /
    missingSkills / recommendations)."""
    text_lower = text.lower()

    def skill_present(skill: str) -> bool:
        # Word-boundary match so "Java" doesn't false-positive on "JavaScript",
        # "SQL" doesn't match inside another word, etc. Multi-word/symbol
        # skills (e.g. "CI/CD", "Node.js") still match via plain substring.
        pattern = skill.lower()
        if re.match(r"^[a-z0-9]+$", pattern):
            return re.search(rf"\b{re.escape(pattern)}\b", text_lower) is not None
        return pattern in text_lower

    extracted = [s for s in KNOWN_SKILLS if skill_present(s)]
    if not extracted:
        # Last-resort guard: extraction succeeded but the document contained no
        # recognisable skill keywords (e.g. scanned/image-only PDF with no text
        # layer, or a very brief plain-text file). Return a minimal set so the
        # UI is never left completely empty, but this should rarely trigger now
        # that real PDF/DOCX extraction is in place.
        extracted = ["JavaScript", "HTML", "CSS", "Git"]

    all_skills_set = {s.lower() for s in KNOWN_SKILLS}
    extracted_set = {s.lower() for s in extracted}
    missing_pool = [s for s in KNOWN_SKILLS if s.lower() not in extracted_set]
    missing = missing_pool[:3] if missing_pool else []

    word_count = len(re.findall(r"\w+", text))
    has_numbers = bool(re.search(r"\d", text))

    score = 50
    score += min(len(extracted) * 4, 24)
    score += 10 if has_numbers else 0
    score += 10 if word_count > 80 else 0
    score = max(0, min(score, 100))

    strengths = []
    if has_numbers:
        strengths.append("Quantified achievements")
    if len(extracted) >= 4:
        strengths.append("Strong breadth of listed skills")
    if word_count > 150:
        strengths.append("Detailed project descriptions")
    if not strengths:
        strengths = ["Clear, readable formatting"]

    recommendations = [
        "Add measurable outcomes to your last two roles (e.g. % improvement, users impacted).",
        "Include a dedicated skills section near the top for faster scanning.",
    ]
    if missing:
        recommendations.append(f"Consider adding experience with: {', '.join(missing)}.")
    if target_role:
        recommendations.append(f"Tailor your summary line to explicitly mention '{target_role}'.")

    return {
        "score": score,
        "extractedSkills": extracted,
        "strengths": strengths,
        "missingSkills": missing,
        "recommendations": recommendations,
    }
