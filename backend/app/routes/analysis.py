import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SkillAnalysisModel
from app.schemas.analysis import SkillGapRequest, SkillGapResponse
from app.services.skill_gap import calculate_skill_gap
from app.services.resume_parser import get_demo_resume_data
from app.services.job_analyzer import get_demo_job_data

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])


@router.post("/skill-gap", response_model=SkillGapResponse, summary="Compute skill gap and readiness score")
def compute_skill_gap_endpoint(payload: SkillGapRequest, db: Session = Depends(get_db)):
    """
    Compares candidate resume skills against target job description requirements.
    Calculates exact matched skills, transferable partial skills, missing competencies,
    persists result in SQLite, and returns an objective Career Readiness Score.
    """
    result = calculate_skill_gap(
        resume_skills=payload.resume_skills,
        job_skills=payload.job_skills,
        job_title=payload.job_title or "Target Role"
    )

    # Persist analysis to SQLite
    db_analysis = SkillAnalysisModel(
        job_title=payload.job_title or "Target Role",
        matched_skills_json=json.dumps(result.matched_skills),
        partial_skills_json=json.dumps(result.partial_skills),
        missing_skills_json=json.dumps(result.missing_skills),
        match_percentage=result.match_percentage,
        career_readiness_score=result.career_readiness_score,
        score_status=result.score_status,
        score_explanation=result.score_explanation,
        recommendations_json=json.dumps(result.recommendations)
    )
    db.add(db_analysis)
    db.commit()

    return result


@router.get("/demo", response_model=SkillGapResponse, summary="Precomputed demo skill gap analysis")
def get_demo_skill_gap(db: Session = Depends(get_db)):
    """
    Convenience endpoint returning the evaluated skill gap comparison
    between Alex Johnson's resume and the Junior Backend Developer target job,
    persisting the record to SQLite.
    """
    resume = get_demo_resume_data()
    job = get_demo_job_data()
    result = calculate_skill_gap(
        resume_skills=resume.skills,
        job_skills=job.required_skills,
        job_title=job.job_title
    )

    db_analysis = SkillAnalysisModel(
        job_title=job.job_title,
        matched_skills_json=json.dumps(result.matched_skills),
        partial_skills_json=json.dumps(result.partial_skills),
        missing_skills_json=json.dumps(result.missing_skills),
        match_percentage=result.match_percentage,
        career_readiness_score=result.career_readiness_score,
        score_status=result.score_status,
        score_explanation=result.score_explanation,
        recommendations_json=json.dumps(result.recommendations)
    )
    db.add(db_analysis)
    db.commit()

    return result

