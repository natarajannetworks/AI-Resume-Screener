from fastapi import APIRouter

router = APIRouter()

job_description_data = ""

@router.post("/job-description")
def save_job_description(data: dict):

    global job_description_data

    job_description_data = data.get("job_description", "")

    return {
        "message": "Job Description Saved Successfully"
    }


@router.get("/job-description")
def get_job_description():

    return {
        "job_description": job_description_data
    }