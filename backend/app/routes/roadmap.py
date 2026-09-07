import json
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RoadmapModel, RoadmapItemModel
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
def generate_roadmap_endpoint(payload: RoadmapGenerateRequest, db: Session = Depends(get_db)):
    """
    Constructs a sequential, milestone-ordered learning roadmap,
    persists roadmap and items in SQLite, and returns roadmap.
    """
    res = create_roadmap(
        missing_skills=payload.missing_skills,
        job_title=payload.job_title or "Software Developer",
        target_company=payload.target_company or "Target Company"
    )

    # Persist to SQLite
    db_roadmap = RoadmapModel(
        job_title=res.job_title,
        total_items=res.total_items,
        completed_items=res.completed_items,
        progress_percentage=res.progress_percentage
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)

    for item in res.items:
        db_item = RoadmapItemModel(
            roadmap_id=db_roadmap.id,
            number=item.number,
            skill=item.skill,
            description=item.description,
            difficulty=item.difficulty,
            time_estimate=item.time_estimate,
            completed=item.completed,
            prerequisites_json=json.dumps(item.prerequisites)
        )
        db.add(db_item)
    db.commit()

    return res


@router.patch("/{item_id}/progress", response_model=RoadmapItemSchema, summary="Toggle completion progress for a roadmap milestone")
def update_item_progress_endpoint(item_id: int, payload: RoadmapProgressUpdate, db: Session = Depends(get_db)):
    """
    Updates the completion status of an individual roadmap milestone 
    in memory and in SQLite, recalculating total progress.
    """
    updated_item = update_roadmap_item_progress(item_id=item_id, completed=payload.completed)
    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap milestone item with ID {item_id} was not found."
        )

    # Update in SQLite if present
    db_item = db.query(RoadmapItemModel).filter(RoadmapItemModel.id == item_id).first()
    if db_item:
        db_item.completed = payload.completed
        db.commit()

    return updated_item


@router.post("/demo", response_model=RoadmapGenerateResponse, summary="Load standard evaluation demo roadmap")
def load_demo_roadmap(db: Session = Depends(get_db)):
    """
    Returns the pre-configured Junior Backend Developer roadmap 
    and persists record in SQLite.
    """
    res = get_demo_roadmap_data()
    db_roadmap = RoadmapModel(
        job_title=res.job_title,
        total_items=res.total_items,
        completed_items=res.completed_items,
        progress_percentage=res.progress_percentage
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)

    for item in res.items:
        db_item = RoadmapItemModel(
            roadmap_id=db_roadmap.id,
            number=item.number,
            skill=item.skill,
            description=item.description,
            difficulty=item.difficulty,
            time_estimate=item.time_estimate,
            completed=item.completed,
            prerequisites_json=json.dumps(item.prerequisites)
        )
        db.add(db_item)
    db.commit()

    return res


@router.get("/demo", response_model=RoadmapGenerateResponse, summary="Fetch demo roadmap (GET)")
def get_demo_roadmap():
    """
    Convenience GET endpoint for the evaluation demo roadmap.
    """
    return get_demo_roadmap_data()

