from typing import List, Optional
from pydantic import BaseModel, Field


class ResumeParsedData(BaseModel):
    candidate_name: Optional[str] = Field(default=None, description="Extracted candidate full name")
    email: Optional[str] = Field(default=None, description="Extracted primary email address")
    phone: Optional[str] = Field(default=None, description="Extracted phone number")
    links: List[str] = Field(default_factory=list, description="Detected portfolio or profile links (GitHub, LinkedIn)")
    education: List[str] = Field(default_factory=list, description="Extracted educational qualifications and degrees")
    experience: List[str] = Field(default_factory=list, description="Extracted work experience and roles")
    projects: List[str] = Field(default_factory=list, description="Extracted project descriptions and titles")
    skills: List[str] = Field(default_factory=list, description="Extracted technical competencies and skills")
    raw_text_preview: str = Field(default="", description="First 500 characters of extracted document text")
    filename: str = Field(default="uploaded_resume", description="Original file name")
    file_size_kb: float = Field(default=0.0, description="File size in kilobytes")
    is_demo: bool = Field(default=False, description="Whether this resume is loaded from demo dataset")
