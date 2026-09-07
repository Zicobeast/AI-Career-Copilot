from fastapi import APIRouter
from app.schemas.analysis import SkillGapRequest, SkillGapResponse
from app.services.skill_gap import calculate_skill_gap
from app.services.resume_parser import get_demo_resume_data
from app.services.job_analyzer import get_demo_job_data

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])


@router.post("/skill-gap", response_model=SkillGapResponse, summary="Compute skill gap and readiness score")
def compute_skill_gap_endpoint(payload: SkillGapRequest):
    """
    Compares candidate resume skills against target job description requirements.
    Calculates exact matched skills, transferable partial skills, missing competencies,
    and returns an objective Career Readiness Score.
    """
    return calculate_skill_gap(
        resume_skills=payload.resume_skills,
        job_skills=payload.job_skills,
        job_title=payload.job_title or "Target Role"
    )


@router.get("/demo", response_model=SkillGapResponse, summary="Precomputed demo skill gap analysis")
def get_demo_skill_gap():
    """
    Convenience endpoint returning the evaluated skill gap comparison
    between Alex Johnson's resume and the Junior Backend Developer target job.
    """
    resume = get_demo_resume_data()
    job = get_demo_job_data()
    return calculate_skill_gap(
        resume_skills=resume.skills,
        job_skills=job.required_skills,
        job_title=job.job_title
    )
