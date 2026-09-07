@echo off
title AI Career Copilot - Frontend Server
echo =======================================================
echo         AI Career Copilot - Frontend Launcher
echo =======================================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [INFO] node_modules not found. Running npm install...
    call npm install
)

echo Starting Vite React Frontend server...
echo Frontend will be accessible at http://localhost:5173
echo Press CTRL+C to stop.
echo.

call npm run dev
pause
