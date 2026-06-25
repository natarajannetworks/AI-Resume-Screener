from fastapi import APIRouter, HTTPException
from app.database import SessionLocal, Candidate

router = APIRouter()


@router.get("/candidates")
def get_candidates(analysis_id: int = None):
    db = SessionLocal()
    query = db.query(Candidate)
    if analysis_id is not None:
        query = query.filter(Candidate.analysis_id == analysis_id)

    candidates = query.order_by(Candidate.score.desc()).all()
    result = []
    for c in candidates:
        result.append({
            "id": c.id,
            "rank": c.rank,
            "name": c.candidate_name or c.filename,
            "fileName": c.filename,
            "score": c.score,
            "rating": c.rating,
            "ratingColor": c.rating_color,
            "totalExperience": f"{c.experience_years} Years" if c.experience_years else "—",
            "skills": [s for s in (c.skills_matched or "").split(",") if s],
            "recommendation": c.hire_recommendation,
            "resume_preview": (c.resume_text or "")[:200],
            "analyzed": bool(c.analyzed),
        })
    db.close()
    return result


@router.get("/candidates/{candidate_id}")
def get_candidate_detail(candidate_id: int):
    db = SessionLocal()
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    db.close()

    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return {
        "id": c.id,
        "rank": c.rank,
        "name": c.candidate_name or c.filename,
        "fileName": c.filename,
        "email": c.email,
        "phone": c.phone,
        "score": c.score,
        "rating": c.rating,
        "ratingColor": c.rating_color,
        "totalExperience": f"{c.experience_years} Years" if c.experience_years else "—",
        "skills": [s for s in (c.skills_matched or "").split(",") if s],
        "missingSkills": [s for s in (c.skills_missing or "").split(",") if s],
        "strengths": [s for s in (c.strengths or "").split("|") if s],
        "weaknesses": [s for s in (c.weaknesses or "").split("|") if s],
        "summary": c.reasoning,
        "recommendation": c.hire_recommendation,
        "resumeText": c.resume_text,
    }
