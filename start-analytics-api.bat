@echo off
echo Starting Zenith Policy Guard Analytics API...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to analytics API directory
cd /d "%~dp0analytics-api"

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found
    echo Please ensure you're running this script from the correct directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found
    echo Creating .env file from template...
    if exist ".env.example" (
        copy ".env.example" ".env"
    ) else (
        echo Creating basic .env file...
        echo PORT=3001 > .env
        echo NODE_ENV=development >> .env
        echo MONGODB_URI=mongodb+srv://yashbalpande25_db_user:5PDnaVKFmn3D4uBh@cluster0.aa0bqrb.mongodb.net/zenith-analytics?retryWrites=true^&w=majority^&appName=Cluster0 >> .env
        echo CORS_ORIGIN=http://localhost:8082,http://localhost:3000 >> .env
    )
    echo .env file created successfully
    echo.
)

echo Starting Analytics API server...
echo Server will be available at: http://localhost:3001
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm run dev

pause
