from typing import List, Optional
from pydantic import BaseModel, Field


class RoadmapItemSchema(BaseModel):
    id: int = Field(..., description="Unique integer milestone ID")
    number: str = Field(..., description="Two-digit sequential order string, e.g. '01', '02'")
    skill: str = Field(..., description="Technical competency or capstone deliverable name")
    description: str = Field(..., description="Actionable learning curriculum and practical objectives")
    difficulty: str = Field(default="Intermediate", description="Difficulty tier: Beginner, Intermediate, Advanced")
    time_estimate: str = Field(..., description="Estimated completion duration, e.g., '1.5 Weeks'")
    completed: bool = Field(default=False, description="Whether milestone has been finished")
    prerequisites: List[str] = Field(default_factory=list, description="Recommended foundational skills before tackling this milestone")


class RoadmapGenerateRequest(BaseModel):
    missing_skills: List[str] = Field(..., description="List of missing competencies to build learning path for")
    job_title: Optional[str] = Field(default="Target Role", description="Target job title")
    target_company: Optional[str] = Field(default="Target Company", description="Target hiring organization")


class RoadmapGenerateResponse(BaseModel):
    roadmap_id: str = Field(default="roadmap_current", description="Roadmap identifier")
    job_title: str = Field(..., description="Target role name")
    total_items: int = Field(..., description="Total milestones in roadmap")
    completed_items: int = Field(..., description="Total completed milestones")
    progress_percentage: int = Field(..., description="Percentage of roadmap milestones completed (0-100)")
    items: List[RoadmapItemSchema] = Field(..., description="Ordered list of sequential milestones")


class RoadmapProgressUpdate(BaseModel):
    completed: bool = Field(..., description="Target completion boolean status")
