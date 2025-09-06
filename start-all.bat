@echo off
echo ========================================
echo   Zenith Policy Guard - Full Stack
echo ========================================
echo.

echo Starting both Frontend and Analytics API...
echo Frontend will be available at: http://localhost:8082
echo Analytics API will be available at: http://localhost:3001
echo.

REM Start both servers in separate windows
start "Zenith Frontend" cmd /k "npm run dev"
start "Analytics API" cmd /k "cd analytics-api && node server.js"

echo Both servers are starting in separate windows...
echo Press any key to exit this launcher...
pause > nul
