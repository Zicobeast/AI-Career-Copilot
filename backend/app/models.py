import json
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base


class ResumeModel(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String(100), default="Candidate")
    email = Column(String(150), nullable=True)
    phone = Column(String(50), nullable=True)
    filename = Column(String(255), default="resume.pdf")
    file_size_kb = Column(Float, default=0.0)
    skills_json = Column(Text, default="[]")
    education_json = Column(Text, default="[]")
    experience_json = Column(Text, default="[]")
    projects_json = Column(Text, default="[]")
    raw_text_preview = Column(Text, default="")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def skills(self):
        try:
            return json.loads(self.skills_json)
        except Exception:
            return []

    @skills.setter
    def skills(self, val):
        self.skills_json = json.dumps(val)


class JobDescriptionModel(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(150), default="Software Developer")
    company = Column(String(150), default="Target Company")
    description = Column(Text, default="")
    required_skills_json = Column(Text, default="[]")
    categorized_skills_json = Column(Text, default="{}")
    total_skills = Column(Integer, default=0)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def required_skills(self):
        try:
            return json.loads(self.required_skills_json)
        except Exception:
            return []

    @required_skills.setter
    def required_skills(self, val):
        self.required_skills_json = json.dumps(val)


class SkillAnalysisModel(Base):
    __tablename__ = "skill_analyses"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(150), default="Target Role")
    matched_skills_json = Column(Text, default="[]")
    partial_skills_json = Column(Text, default="[]")
    missing_skills_json = Column(Text, default="[]")
    match_percentage = Column(Integer, default=0)
    career_readiness_score = Column(Integer, default=0)
    score_status = Column(String(100), default="On Track")
    score_explanation = Column(Text, default="")
    recommendations_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RoadmapModel(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(150), default="Software Developer")
    total_items = Column(Integer, default=0)
    completed_items = Column(Integer, default=0)
    progress_percentage = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    items = relationship("RoadmapItemModel", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapItemModel(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False)
    number = Column(String(10), default="01")
    skill = Column(String(100), nullable=False)
    description = Column(Text, default="")
    difficulty = Column(String(50), default="Intermediate")
    time_estimate = Column(String(50), default="1.5 Weeks")
    completed = Column(Boolean, default=False)
    prerequisites_json = Column(Text, default="[]")

    roadmap = relationship("RoadmapModel", back_populates="items")
