@echo off
echo ========================================
echo Job Portal - Automated Setup Script
echo ========================================
echo.

echo [1/5] Setting up Backend...
cd backend
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo Please edit backend\.env with your MySQL credentials
    pause
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo [2/5] Setting up Frontend...
cd frontend
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo [3/5] Creating MySQL Database...
echo Please ensure MySQL is running and you have the credentials ready.
echo.
set /p MYSQL_USER="Enter MySQL username (default: root): "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASS="Enter MySQL password: "

echo Creating database 'job_portal'...
mysql -u %MYSQL_USER% -p%MYSQL_PASS% -e "CREATE DATABASE IF NOT EXISTS job_portal;"
if %errorlevel% neq 0 (
    echo Failed to create database. Please create it manually.
    echo Run: CREATE DATABASE job_portal;
)

echo.
echo [4/5] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Edit backend\.env with your MySQL credentials:
echo    - DB_USER=%MYSQL_USER%
echo    - DB_PASSWORD=your_password
echo    - DB_NAME=job_portal
echo.
echo 2. Start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open your browser:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo ========================================
echo.

set /p START="Do you want to start the servers now? (y/n): "
if /i "%START%"=="y" (
    echo.
    echo Starting servers...
    echo Backend will run in this window
    echo Frontend will open in a new window
    echo.
    start cmd /k "cd frontend && npm run dev"
    cd backend
    npm run dev
) else (
    echo.
    echo Setup complete! Run the servers manually when ready.
    pause
)
