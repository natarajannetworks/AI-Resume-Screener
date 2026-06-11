from fastapi import FastAPI

from app.routes.upload import router as upload_router
from app.routes.candidate import router as candidate_router
from app.routes.ranking import router as ranking_router

app = FastAPI(title="AI Resume Screener Backend")

app.include_router(upload_router)
app.include_router(candidate_router)
app.include_router(ranking_router)

@app.get("/")
def root():
    return {"message": "Backend Running Successfully"}