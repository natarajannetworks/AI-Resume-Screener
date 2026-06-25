from fastapi import APIRouter
from app.database import SessionLocal, Candidate
from collections import Counter

router = APIRouter()


@router.get("/analytics")
def get_analytics(analysis_id: int = None):
    """Aggregated stats for the Analytics page charts."""
    db = SessionLocal()
    query = db.query(Candidate).filter(Candidate.analyzed == 1)
    if analysis_id is not None:
        query = query.filter(Candidate.analysis_id == analysis_id)

    candidates = query.all()
    db.close()

    if not candidates:
        return {
            "totalCandidates": 0,
            "averageScore": 0,
            "topScore": 0,
            "matchDistribution": {"strong": 0, "partial": 0, "weak": 0},
            "topSkills": [],
            "scoreHistogram": [],
        }

    scores = [c.score for c in candidates]
    strong = len([c for c in candidates if c.rating_color == "GREEN"])
    partial = len([c for c in candidates if c.rating_color == "YELLOW"])
    weak = len([c for c in candidates if c.rating_color == "RED"])

    # Top skills across the candidate pool
    skill_counter = Counter()
    for c in candidates:
        for skill in (c.skills_matched or "").split(","):
            skill = skill.strip()
            if skill:
                skill_counter[skill] += 1
    top_skills = [{"skill": s, "count": n} for s, n in skill_counter.most_common(8)]

    # Score histogram in 10-point buckets for a bar/line chart
    buckets = {f"{i}-{i+9}": 0 for i in range(0, 100, 10)}
    for s in scores:
        bucket_start = min((s // 10) * 10, 90)
        key = f"{bucket_start}-{bucket_start+9}"
        buckets[key] += 1
    histogram = [{"range": k, "count": v} for k, v in buckets.items()]

    return {
        "totalCandidates": len(candidates),
        "averageScore": round(sum(scores) / len(scores), 1),
        "topScore": max(scores),
        "matchDistribution": {"strong": strong, "partial": partial, "weak": weak},
        "topSkills": top_skills,
        "scoreHistogram": histogram,
    }
