from typing import List, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender: 'user' or 'assistant'")
    content: str = Field(..., description="Text content of the message")


class ChatContext(BaseModel):
    candidate_name: Optional[str] = Field(default="Candidate", description="Candidate's name")
    target_job_title: Optional[str] = Field(default="Junior Backend Developer", description="Target job title")
    resume_skills: List[str] = Field(default_factory=list, description="Extracted resume skills")
    matched_skills: List[str] = Field(default_factory=list, description="Skills matching job requirements")
    missing_skills: List[str] = Field(default_factory=list, description="Skills missing from candidate profile")
    readiness_score: int = Field(default=72, description="Calculated career readiness score")
    roadmap_progress: int = Field(default=40, description="Percentage of roadmap milestones completed")
    next_recommended_skill: Optional[str] = Field(default="FastAPI", description="Next skill to learn")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User prompt or career question")
    history: List[ChatMessage] = Field(default_factory=list, description="Recent conversation turns")
    context: Optional[ChatContext] = Field(default=None, description="Current candidate resume and job context")


class ChatResponse(BaseModel):
    reply: str = Field(..., description="Contextual career assistant reply")
    source: str = Field(default="rule_based_engine", description="Response source: 'gemini_api' or 'rule_based_engine'")
    timestamp: str = Field(..., description="ISO timestamp")
    suggested_followups: List[str] = Field(default_factory=list, description="Contextual follow-up question chips")
