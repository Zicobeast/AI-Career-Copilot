from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class JobAnalysisRequest(BaseModel):
    job_title: str = Field(..., min_length=2, description="Target job title, e.g., 'Junior Backend Developer'")
    company: Optional[str] = Field(default="Target Company", description="Hiring organization name")
    description: str = Field(..., min_length=10, description="Full or excerpted text of job posting requirements")


class JobAnalysisResponse(BaseModel):
    job_title: str = Field(..., description="Normalized target job role")
    company: str = Field(default="Target Company", description="Hiring company")
    required_skills: List[str] = Field(..., description="List of technical skills extracted from requirements")
    categorized_skills: Dict[str, List[str]] = Field(default_factory=dict, description="Extracted skills grouped by domain")
    total_skills: int = Field(..., description="Total count of technical competencies required")
    description_snippet: str = Field(default="", description="Summary excerpt of the analyzed job posting")
    is_demo: bool = Field(default=False, description="Flag indicating if this is preloaded evaluation demo data")
