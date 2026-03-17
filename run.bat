@echo off
REM OSINT Threat Monitoring - one-click runner

REM Change to folder of this script (project root)
cd /d "%~dp0"

echo [OSINT] Initializing database and running collector once...
cd /d "%~dp0backend"
python run_collector.py

echo [OSINT] Starting FastAPI backend ...
start "OSINT Backend" cmd /k "cd /d \"%~dp0backend\" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [OSINT] Starting Next.js frontend ...
cd /d "%~dp0frontend"
start "OSINT Frontend" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo [OSINT] Backend and frontend have been started in separate windows.
echo [OSINT] Press any key to close this launcher (servers will keep running)...
pause >nul

