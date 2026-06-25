from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional
from app.services.pdf_parser import extract_text_from_pdf
from app.database import SessionLocal, Candidate, JobAnalysis
import os

router = APIRouter()

UPLOAD_FOLDER = "app/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Single-file upload (kept for backward compatibility)."""
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    resume_text = extract_text_from_pdf(file_path)

    db = SessionLocal()
    new_candidate = Candidate(
        filename=file.filename,
        resume_text=resume_text,
        score=0,
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    candidate_id = new_candidate.id
    db.close()

    return {
        "id": candidate_id,
        "filename": file.filename,
        "status": "Ready for AI Analysis"
    }


@router.post("/upload-batch")
async def upload_resumes_batch(
    files: List[UploadFile] = File(...),
    job_description: Optional[str] = Form(None),
    job_title: Optional[str] = Form("Untitled Role"),
):
    """Upload multiple resumes at once and create a JobAnalysis batch.
    This is what the frontend's main 'Analyze Candidates' flow should call.
    Returns the analysis_id which is then passed to /analyze-all.
    """
    db = SessionLocal()

    analysis = JobAnalysis(
        job_title=job_title or "Untitled Role",
        job_description=job_description or "",
        candidate_count=len(files),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    analysis_id = analysis.id

    uploaded = []
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        resume_text = extract_text_from_pdf(file_path)

        candidate = Candidate(
            analysis_id=analysis_id,
            filename=file.filename,
            resume_text=resume_text,
            score=0,
        )
        db.add(candidate)
        uploaded.append(file.filename)

    db.commit()
    db.close()

    return {
        "analysis_id": analysis_id,
        "uploaded_files": uploaded,
        "status": "Ready for AI Analysis"
    }
