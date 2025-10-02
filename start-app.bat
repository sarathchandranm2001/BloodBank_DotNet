@echo off
echo Starting Blood Bank Management System...
echo ========================================

echo Starting .NET API Backend...
cd BloodBankManagement
start "Backend API" cmd /k "dotnet run --urls=https://localhost:7001"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo Starting Angular Frontend...
cd ..\blood-bank-frontend
start "Frontend App" cmd /k "ng serve --port 4200"

echo.
echo System started successfully!
echo Backend running on: https://localhost:7001
echo Frontend running on: http://localhost:4200
echo.
echo Both applications are running in separate command windows.
echo Close those windows to stop the applications.

pause