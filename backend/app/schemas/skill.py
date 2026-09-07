from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class SkillItem(BaseModel):
    name: str = Field(..., description="Canonical standard skill name")
    category: str = Field(..., description="Skill technical category")
    matched_synonym: Optional[str] = Field(default=None, description="The specific term or synonym matched in text")


class SkillExtractRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw text from resume, profile, or job posting to extract skills from")


class SkillExtractResponse(BaseModel):
    total_count: int = Field(..., description="Total unique skills extracted")
    skills: List[str] = Field(..., description="Alphabetical list of unique standard skill names")
    categorized: Dict[str, List[str]] = Field(..., description="Skills grouped by domain category")


class SkillCatalogResponse(BaseModel):
    total_catalog_skills: int = Field(..., description="Total recognizable skills in system catalog")
    categories: Dict[str, List[str]] = Field(..., description="All catalog skills organized by category")
