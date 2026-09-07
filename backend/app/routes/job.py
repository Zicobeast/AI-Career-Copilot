from fastapi import APIRouter, HTTPException, status
from app.schemas.job import JobAnalysisRequest, JobAnalysisResponse
from app.services.job_analyzer import analyze_job_posting, get_demo_job_data

router = APIRouter(prefix="/api/job", tags=["Job"])


@router.post("/analyze", response_model=JobAnalysisResponse, summary="Analyze job posting description")
def analyze_job_endpoint(payload: JobAnalysisRequest):
    """
    Parses a target job description, extracts key required technical competencies,
    categorizes them, and returns structured requirements for skill gap matching.
    """
    if not payload.description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text cannot be empty."
        )

    return analyze_job_posting(
        job_title=payload.job_title,
        description=payload.description,
        company=payload.company
    )


@router.post("/demo", response_model=JobAnalysisResponse, summary="Load standard evaluation demo target job")
def load_demo_job():
    """
    Returns pre-configured Junior Backend Developer target job 
    at CloudScale Systems with required skills (Python, FastAPI, SQL, PostgreSQL, Git, Docker, AWS).
    """
    return get_demo_job_data()


@router.get("/demo", response_model=JobAnalysisResponse, summary="Fetch demo target job (GET)")
def get_demo_job():
    """
    Convenience GET endpoint for the evaluation demo target job.
    """
    return get_demo_job_data()
