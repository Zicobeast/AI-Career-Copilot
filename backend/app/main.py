from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.resume import router as resume_router
from app.routes.skills import router as skills_router


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API engine for AI Career Copilot - personalized career roadmaps and resume skill-gap analysis.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS) for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular API routes
app.include_router(resume_router)
app.include_router(skills_router)



@app.get("/", tags=["System"])
def root():
    """
    Root endpoint verifying the API service is online.
    """
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "health_check": "/health",
    }


@app.get("/health", tags=["System"])
def health_check():
    """
    System diagnostic endpoint checking service health and timestamp.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": {
            "database_configured": bool(settings.DATABASE_URL),
            "cors_allowed_origins": settings.cors_origins_list,
            "ai_api_configured": bool(settings.GEMINI_API_KEY.strip()) if settings.GEMINI_API_KEY else False,
        },
    }
