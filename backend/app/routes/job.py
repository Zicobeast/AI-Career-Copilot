import json
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobDescriptionModel
from app.schemas.job import JobAnalysisRequest, JobAnalysisResponse
from app.services.job_analyzer import analyze_job_posting, get_demo_job_data

router = APIRouter(prefix="/api/job", tags=["Job"])


@router.post("/analyze", response_model=JobAnalysisResponse, summary="Analyze job posting description")
def analyze_job_endpoint(payload: JobAnalysisRequest, db: Session = Depends(get_db)):
    """
    Parses a target job description, extracts key required technical competencies,
    categorizes them, persists to SQLite, and returns structured requirements.
    """
    if not payload.description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text cannot be empty."
        )

    result = analyze_job_posting(
        job_title=payload.job_title,
        description=payload.description,
        company=payload.company
    )

    # Persist to SQLite
    db_job = JobDescriptionModel(
        job_title=result.job_title,
        company=result.company,
        description=payload.description,
        required_skills_json=json.dumps(result.required_skills),
        categorized_skills_json=json.dumps(result.categorized_skills),
        total_skills=result.total_skills,
        is_demo=False
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return result


@router.post("/demo", response_model=JobAnalysisResponse, summary="Load standard evaluation demo target job")
def load_demo_job(db: Session = Depends(get_db)):
    """
    Returns pre-configured Junior Backend Developer target job 
    and persists record in SQLite.
    """
    data = get_demo_job_data()
    db_job = JobDescriptionModel(
        job_title=data.job_title,
        company=data.company,
        description=data.description_snippet,
        required_skills_json=json.dumps(data.required_skills),
        categorized_skills_json=json.dumps(data.categorized_skills),
        total_skills=data.total_skills,
        is_demo=True
    )
    db.add(db_job)
    db.commit()
    return data


@router.get("/demo", response_model=JobAnalysisResponse, summary="Fetch demo target job (GET)")
def get_demo_job():
    """
    Convenience GET endpoint for the evaluation demo target job.
    """
    return get_demo_job_data()

