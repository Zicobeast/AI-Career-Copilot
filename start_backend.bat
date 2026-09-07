@echo off
title AI Career Copilot - Backend Server
echo =======================================================
echo         AI Career Copilot - Backend Launcher
echo =======================================================
echo.

cd /d "%~dp0backend"

if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Python virtual environment not found in backend\venv!
    echo Please create it first:
    echo   cd backend
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

echo Activating Python virtual environment...
call venv\Scripts\activate.bat

echo Starting FastAPI Backend server on http://localhost:8000...
echo API Docs will be available at http://localhost:8000/docs
echo Press CTRL+C to stop.
echo.

uvicorn app.main:app --reload --port 8000
pause
