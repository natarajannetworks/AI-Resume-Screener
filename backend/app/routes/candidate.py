from fastapi import APIRouter

router = APIRouter()

@router.get("/candidates")
def get_candidates():
    return [
        {
            "id": 1,
            "name": "Arun Kumar",
            "score": 87
        },
        {
            "id": 2,
            "name": "Rahul",
            "score": 76
        }
    ]