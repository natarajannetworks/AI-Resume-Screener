from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {
        "message": "AI Resume Screener Backend Running Successfully"
    }

@router.get("/health")
def health_check():
    return {
        "status": "healthy"
    }