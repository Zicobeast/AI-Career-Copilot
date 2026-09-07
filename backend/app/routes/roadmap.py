from fastapi import APIRouter, HTTPException, status
from app.schemas.roadmap import (
    RoadmapGenerateRequest,
    RoadmapGenerateResponse,
    RoadmapItemSchema,
    RoadmapProgressUpdate
)
from app.services.roadmap import (
    create_roadmap,
    update_roadmap_item_progress,
    get_demo_roadmap_data
)

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])


@router.post("/generate", response_model=RoadmapGenerateResponse, summary="Generate personalized learning roadmap")
def generate_roadmap_endpoint(payload: RoadmapGenerateRequest):
    """
    Constructs a sequential, milestone-ordered learning roadmap 
    specifically targeting the candidate's missing competencies.
    """
    return create_roadmap(
        missing_skills=payload.missing_skills,
        job_title=payload.job_title or "Software Developer",
        target_company=payload.target_company or "Target Company"
    )


@router.patch("/{item_id}/progress", response_model=RoadmapItemSchema, summary="Toggle completion progress for a roadmap milestone")
def update_item_progress_endpoint(item_id: int, payload: RoadmapProgressUpdate):
    """
    Updates the completion status of an individual roadmap milestone 
    and recalculates total learning path progress.
    """
    updated_item = update_roadmap_item_progress(item_id=item_id, completed=payload.completed)
    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap milestone item with ID {item_id} was not found."
        )
    return updated_item


@router.post("/demo", response_model=RoadmapGenerateResponse, summary="Load standard evaluation demo roadmap")
def load_demo_roadmap():
    """
    Returns the pre-configured Junior Backend Developer roadmap 
    (FastAPI, PostgreSQL, Docker, AWS, Production Capstone Project).
    """
    return get_demo_roadmap_data()


@router.get("/demo", response_model=RoadmapGenerateResponse, summary="Fetch demo roadmap (GET)")
def get_demo_roadmap():
    """
    Convenience GET endpoint for the evaluation demo roadmap.
    """
    return get_demo_roadmap_data()
