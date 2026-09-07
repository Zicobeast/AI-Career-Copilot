@echo off
title AI Career Copilot - Test Suite
echo =======================================================
echo         AI Career Copilot - Test Runner
echo =======================================================
echo.

echo [1/2] Running Backend Test Suite (31 Unit + E2E Tests)...
cd /d "%~dp0backend"
if exist "venv\Scripts\python.exe" (
    venv\Scripts\python.exe -m unittest discover -s . -p "test_*.py" -v
) else (
    python -m unittest discover -s . -p "test_*.py" -v
)
if %ERRORLEVEL% neq 0 (
    echo.
    echo [FAIL] Backend tests failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Running Frontend Production Build (Vite)...
cd /d "%~dp0frontend"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [FAIL] Frontend build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =======================================================
echo [SUCCESS] All 31 backend tests and frontend build passed!
echo =======================================================
echo.
pause
