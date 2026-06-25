from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.database import SessionLocal, JobAnalysis
from app.exports.excel_report import generate_excel_report
from app.exports.pdf_report import generate_pdf_report
import os

router = APIRouter()

REPORTS_FOLDER = "app/generated_reports"
os.makedirs(REPORTS_FOLDER, exist_ok=True)


def _build_candidate_rows(analysis: JobAnalysis):
    rows = []
    for c in sorted(analysis.candidates, key=lambda x: x.score, reverse=True):
        rows.append({
            "rank": c.rank,
            "name": c.candidate_name or c.filename,
            "score": c.score,
            "rating": c.rating,
            "recommendation": c.hire_recommendation,
            "skills": [s for s in (c.skills_matched or "").split(",") if s],
            "totalExperience": f"{c.experience_years} Years" if c.experience_years else "—",
        })
    return rows


@router.get("/reports/{analysis_id}/excel")
def export_excel(analysis_id: int):
    db = SessionLocal()
    analysis = db.query(JobAnalysis).filter(JobAnalysis.id == analysis_id).first()
    if not analysis:
        db.close()
        raise HTTPException(status_code=404, detail="Analysis not found")

    rows = _build_candidate_rows(analysis)
    db.close()

    if not rows:
        raise HTTPException(status_code=400, detail="No scored candidates to export")

    output_path = os.path.join(REPORTS_FOLDER, f"candidates_{analysis_id}.xlsx")
    generate_excel_report(rows, output_file=output_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"candidates_{analysis_id}.xlsx",
    )


@router.get("/reports/{analysis_id}/pdf")
def export_pdf(analysis_id: int):
    db = SessionLocal()
    analysis = db.query(JobAnalysis).filter(JobAnalysis.id == analysis_id).first()
    if not analysis:
        db.close()
        raise HTTPException(status_code=404, detail="Analysis not found")

    rows = _build_candidate_rows(analysis)
    db.close()

    if not rows:
        raise HTTPException(status_code=400, detail="No scored candidates to export")

    output_path = os.path.join(REPORTS_FOLDER, f"candidates_{analysis_id}.pdf")
    generate_pdf_report(rows, output_file=output_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename=f"candidates_{analysis_id}.pdf",
    )


@router.get("/reports")
def list_reportable_analyses():
    """List analyses that have at least one scored candidate - shown on Reports page."""
    db = SessionLocal()
    analyses = db.query(JobAnalysis).order_by(JobAnalysis.created_at.desc()).all()

    result = []
    for a in analyses:
        scored = [c for c in a.candidates if c.analyzed]
        if scored:
            result.append({
                "id": a.id,
                "jobTitle": a.job_title,
                "createdAt": a.created_at.isoformat(),
                "scoredCount": len(scored),
            })
    db.close()
    return result
