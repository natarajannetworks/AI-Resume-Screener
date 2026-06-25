from fastapi import APIRouter, HTTPException
from app.database import SessionLocal, JobAnalysis, Candidate

router = APIRouter()


@router.get("/history")
def get_history():
    """List all past analysis runs, newest first - powers the History page."""
    db = SessionLocal()
    analyses = db.query(JobAnalysis).order_by(JobAnalysis.created_at.desc()).all()

    result = []
    for a in analyses:
        scored_count = len([c for c in a.candidates if c.analyzed])
        top_score = max([c.score for c in a.candidates], default=0)
        result.append({
            "id": a.id,
            "jobTitle": a.job_title,
            "createdAt": a.created_at.isoformat(),
            "candidateCount": a.candidate_count,
            "scoredCount": scored_count,
            "topScore": top_score,
        })
    db.close()
    return result


@router.get("/history/{analysis_id}")
def get_history_detail(analysis_id: int):
    """Reopen one past analysis with its full candidate list."""
    db = SessionLocal()
    analysis = db.query(JobAnalysis).filter(JobAnalysis.id == analysis_id).first()

    if not analysis:
        db.close()
        raise HTTPException(status_code=404, detail="Analysis not found")

    candidates = sorted(analysis.candidates, key=lambda c: c.score, reverse=True)
    result = {
        "id": analysis.id,
        "jobTitle": analysis.job_title,
        "jobDescription": analysis.job_description,
        "createdAt": analysis.created_at.isoformat(),
        "candidates": [
            {
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
                "summary": c.reasoning,
            }
            for c in candidates
        ],
    }
    db.close()
    return result


@router.delete("/history/{analysis_id}")
def delete_history(analysis_id: int):
    db = SessionLocal()
    analysis = db.query(JobAnalysis).filter(JobAnalysis.id == analysis_id).first()
    if not analysis:
        db.close()
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    db.close()
    return {"status": "deleted", "id": analysis_id}
