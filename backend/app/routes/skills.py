from fastapi import APIRouter
from app.schemas.skill import (
    SkillExtractRequest,
    SkillExtractResponse,
    SkillCatalogResponse
)
from app.services.skill_extractor import (
    extract_skills_from_text,
    extract_categorized_skills,
    get_full_catalog
)

router = APIRouter(prefix="/api/skills", tags=["Skills"])


@router.post("/extract", response_model=SkillExtractResponse, summary="Extract and categorize skills from text")
def extract_skills_endpoint(payload: SkillExtractRequest):
    """
    Extracts all recognizable technical skills from provided text, 
    normalizes synonyms, and groups results by category.
    """
    skills = extract_skills_from_text(payload.text)
    categorized = extract_categorized_skills(payload.text)
    return SkillExtractResponse(
        total_count=len(skills),
        skills=skills,
        categorized=categorized
    )


@router.get("/catalog", response_model=SkillCatalogResponse, summary="Get full taxonomy of recognizable technical skills")
def get_skills_catalog_endpoint():
    """
    Returns the comprehensive dictionary of all 120+ supported technical competencies 
    and categories recognized by the platform.
    """
    catalog = get_full_catalog()
    total = sum(len(items) for items in catalog.values())
    return SkillCatalogResponse(
        total_catalog_skills=total,
        categories=catalog
    )
