from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import SessionLocal, Candidate, JobAnalysis
from app.ai_logic.scorer import score_resume, compare_candidates, rank_candidates

router = APIRouter()


class AnalyzeRequest(BaseModel):
    analysis_id: int
    job_description: str


class ComparisonRequest(BaseModel):
    id1: int
    id2: int
    job_description: str


def _candidate_to_dict(cand: Candidate) -> dict:
    """Single source of truth for the shape the frontend receives.
    Field names here MUST match what InputPage/ResultsPage/CandidateDetail expect."""
    return {
        "id": cand.id,
        "rank": cand.rank,
        "name": cand.candidate_name or cand.filename,
        "fileName": cand.filename,
        "email": cand.email,
        "phone": cand.phone,
        "score": cand.score,
        "rating": cand.rating,
        "ratingColor": cand.rating_color,
        "totalExperience": f"{cand.experience_years} Years" if cand.experience_years else "—",
        "skills": [s for s in (cand.skills_matched or "").split(",") if s],
        "missingSkills": [s for s in (cand.skills_missing or "").split(",") if s],
        "strengths": [s for s in (cand.strengths or "").split("|") if s],
        "weaknesses": [s for s in (cand.weaknesses or "").split("|") if s],
        "summary": cand.reasoning,
        "recommendation": cand.hire_recommendation,
    }


@router.post("/analyze-all")
def analyze_all(req: AnalyzeRequest):
    """Score every candidate in a given analysis batch using the real Gemini-backed
    scorer, persist the structured results, and return them ranked."""
    db = SessionLocal()

    analysis = db.query(JobAnalysis).filter(JobAnalysis.id == req.analysis_id).first()
    if not analysis:
        db.close()
        raise HTTPException(status_code=404, detail="Analysis batch not found")

    # Keep the JD on the analysis row up to date
    analysis.job_description = req.job_description
    db.commit()

    candidates = db.query(Candidate).filter(Candidate.analysis_id == req.analysis_id).all()
    if not candidates:
        db.close()
        raise HTTPException(status_code=400, detail="No candidates uploaded for this analysis")

    scored = []
    for cand in candidates:
        ai_result = score_resume(req.job_description, cand.resume_text)

        if "error" in ai_result:
            # Don't crash the whole batch on one bad resume - keep it at the bottom
            cand.score = 0
            cand.rating = "Error"
            cand.rating_color = "RED"
            cand.reasoning = ai_result["error"]
            cand.analyzed = 1
            scored.append(cand)
            continue

        cand.candidate_name = ai_result.get("candidate_name") or cand.filename
        cand.email = ai_result.get("email") or ""
        cand.phone = ai_result.get("phone") or ""
        cand.experience_years = ai_result.get("experience_years") or 0
        cand.score = ai_result.get("match_score", 0)
        cand.rating = ai_result.get("rating", "")
        cand.rating_color = ai_result.get("rating_color", "")

        skills = ai_result.get("skills", {}) or {}
        cand.skills_matched = ",".join(skills.get("matched", []) or [])
        cand.skills_missing = ",".join(skills.get("missing", []) or [])

        cand.strengths = "|".join(ai_result.get("strengths", []) or [])
        cand.weaknesses = "|".join(ai_result.get("weaknesses", []) or [])
        cand.reasoning = ai_result.get("reasoning", "")
        cand.hire_recommendation = ai_result.get("hire_recommendation", "")
        cand.analyzed = 1

        scored.append(cand)

    db.commit()

    # Rank by score descending, persist rank, build response
    scored.sort(key=lambda c: c.score, reverse=True)
    results = []
    for i, cand in enumerate(scored):
        cand.rank = i + 1
        results.append(_candidate_to_dict(cand))

    db.commit()
    db.close()

    return results


@router.get("/rankings")
def get_rankings(analysis_id: int = None):
    """Return previously scored candidates, optionally filtered to one analysis batch."""
    db = SessionLocal()
    query = db.query(Candidate).filter(Candidate.analyzed == 1)
    if analysis_id is not None:
        query = query.filter(Candidate.analysis_id == analysis_id)

    candidates = query.order_by(Candidate.score.desc()).all()
    results = [_candidate_to_dict(c) for c in candidates]
    db.close()
    return results


@router.post("/compare")
async def compare_two(req: ComparisonRequest):
    """Compare two already-scored candidates. Builds proper candidate dicts
    (matching what compare_candidates() expects) instead of passing raw text."""
    db = SessionLocal()
    c1 = db.query(Candidate).filter(Candidate.id == req.id1).first()
    c2 = db.query(Candidate).filter(Candidate.id == req.id2).first()

    if not c1 or not c2:
        db.close()
        raise HTTPException(status_code=404, detail="Candidates not found")

    candidate_1 = {
        "candidate_name": c1.candidate_name or c1.filename,
        "match_score": c1.score,
        "experience_years": c1.experience_years,
        "skills": (c1.skills_matched or "").split(","),
        "reasoning": c1.reasoning,
    }
    candidate_2 = {
        "candidate_name": c2.candidate_name or c2.filename,
        "match_score": c2.score,
        "experience_years": c2.experience_years,
        "skills": (c2.skills_matched or "").split(","),
        "reasoning": c2.reasoning,
    }

    result = compare_candidates(req.job_description, candidate_1, candidate_2)
    db.close()

    if "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])

    return {"status": "success", "data": result}
