#!/bin/bash

echo "Starting Blood Bank Management System..."
echo "========================================"

# Start .NET Backend
echo "Starting .NET API Backend..."
cd BloodBankManagement
dotnet run --urls="https://localhost:7001" &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Start Angular Frontend  
echo "Starting Angular Frontend..."
cd ../blood-bank-frontend
npm start &
FRONTEND_PID=$!

echo "System started successfully!"
echo "Backend running on: https://localhost:7001"
echo "Frontend running on: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID