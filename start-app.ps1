# Blood Bank Management System Startup Script
Write-Host "Starting Blood Bank Management System..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Start .NET Backend in background
Write-Host "Starting .NET API Backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\sarath\Desktop\DotnetApp\BloodBankManagement"
    dotnet run --urls="https://localhost:7001"
}

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Angular Frontend
Write-Host "Starting Angular Frontend..." -ForegroundColor Yellow
Set-Location "C:\Users\sarath\Desktop\DotnetApp\blood-bank-frontend"
ng serve --port 4200 --host 0.0.0.0

# Note: Frontend will run in foreground, backend in background job
# To stop: Press Ctrl+C, then run: Stop-Job $backendJob