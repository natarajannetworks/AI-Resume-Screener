from fastapi import APIRouter

router = APIRouter()

@router.get("/rankings")
def get_rankings():
    return [
        {
            "rank": 1,
            "name": "Arun Kumar",
            "score": 87
        },
        {
            "rank": 2,
            "name": "Rahul",
            "score": 76
        }
    ]