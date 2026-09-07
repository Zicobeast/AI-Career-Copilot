from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.schemas.resume import ResumeParsedData
from app.services.resume_parser import parse_resume_file, get_demo_resume_data

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeParsedData, summary="Upload and parse resume file")
async def upload_resume(file: UploadFile = File(...)):
    """
    Accepts PDF or DOCX file upload, parses structure, contact details, 
    education, work experience, projects, and extracts technical competencies.
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
def load_demo_resume():
    """
    Returns pre-loaded structured resume data for Alex Johnson 
    for fast zero-upload evaluation.
    """
    return get_demo_resume_data()


@router.get("/demo", response_model=ResumeParsedData, summary="Fetch demo resume data (GET)")
def get_demo_resume():
    """
    Convenience GET endpoint for the evaluation demo resume.
    """
    return get_demo_resume_data()
