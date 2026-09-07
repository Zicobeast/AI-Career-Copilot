import json
from fastapi import APIRouter, File, UploadFile, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ResumeModel
from app.schemas.resume import ResumeParsedData
from app.services.resume_parser import parse_resume_file, get_demo_resume_data

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeParsedData, summary="Upload and parse resume file")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts PDF or DOCX file upload, parses structure, contact details, 
    education, work experience, projects, extracts skills, and persists to SQLite.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload request."
        )

    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ["pdf", "docx", "doc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '.{ext}'. Supported formats are PDF (.pdf) and Word (.docx)."
        )

    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded resume file is empty (0 bytes)."
            )

        parsed_data = parse_resume_file(content, file.filename)

        # Persist to SQLite
        db_resume = ResumeModel(
            candidate_name=parsed_data.candidate_name or "Uploaded Candidate",
            email=parsed_data.email,
            phone=parsed_data.phone,
            filename=parsed_data.filename,
            file_size_kb=parsed_data.file_size_kb,
            skills_json=json.dumps(parsed_data.skills),
            education_json=json.dumps(parsed_data.education),
            experience_json=json.dumps(parsed_data.experience),
            projects_json=json.dumps(parsed_data.projects),
            raw_text_preview=parsed_data.raw_text_preview,
            is_demo=False
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)

        return parsed_data
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while parsing the resume: {str(e)}"
        )


@router.post("/demo", response_model=ResumeParsedData, summary="Load standard evaluation demo resume")
def load_demo_resume(db: Session = Depends(get_db)):
    """
    Returns pre-loaded structured resume data for Alex Johnson 
    and persists record in SQLite.
    """
    data = get_demo_resume_data()
    db_resume = ResumeModel(
        candidate_name=data.candidate_name,
        email=data.email,
        phone=data.phone,
        filename=data.filename,
        file_size_kb=data.file_size_kb,
        skills_json=json.dumps(data.skills),
        education_json=json.dumps(data.education),
        experience_json=json.dumps(data.experience),
        projects_json=json.dumps(data.projects),
        raw_text_preview=data.raw_text_preview,
        is_demo=True
    )
    db.add(db_resume)
    db.commit()
    return data


@router.get("/demo", response_model=ResumeParsedData, summary="Fetch demo resume data (GET)")
def get_demo_resume():
    """
    Convenience GET endpoint for the evaluation demo resume.
    """
    return get_demo_resume_data()

