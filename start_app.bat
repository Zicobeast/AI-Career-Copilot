@echo off
title AI Career Copilot Launcher
echo =======================================================
echo        AI Career Copilot - Full App Launcher
echo =======================================================
echo.
echo Launching Backend and Frontend in separate windows...
echo.

start "AI Career Copilot - Backend" cmd /k "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
start "AI Career Copilot - Frontend" cmd /k "%~dp0start_frontend.bat"

echo.
echo =======================================================
echo Both services are booting up:
echo   - Backend API:  http://localhost:8000 (Docs: http://localhost:8000/docs)
echo   - Frontend App: http://localhost:5173
echo.
echo You can now navigate to http://localhost:5173 in your browser.
echo Click 'Try Demo' for immediate evaluation!
echo =======================================================
echo.
pause
