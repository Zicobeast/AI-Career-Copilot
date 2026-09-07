from typing import List, Optional
from pydantic import BaseModel, Field


class SkillGapRequest(BaseModel):
    resume_skills: List[str] = Field(..., description="List of skills extracted from candidate resume")
    job_skills: List[str] = Field(..., description="List of required skills extracted from target job description")
    job_title: Optional[str] = Field(default="Target Role", description="Job title for contextual score messaging")


class SkillGapResponse(BaseModel):
    matched_skills: List[str] = Field(..., description="Skills present in both resume and job requirements")
    partial_skills: List[str] = Field(..., description="Related or transferable candidate skills that provide partial coverage")
    missing_skills: List[str] = Field(..., description="Required job skills absent from candidate profile")
    match_percentage: int = Field(..., description="Direct exact skill match percentage (0-100)")
    career_readiness_score: int = Field(..., description="Comprehensive readiness score incorporating exact and partial competencies (0-100)")
    score_status: str = Field(..., description="Concise qualitative assessment")
    score_explanation: str = Field(..., description="Detailed explanation of strengths and actionable next steps")
    recommendations: List[str] = Field(default_factory=list, description="Immediate top priorities to close the skill gap")
