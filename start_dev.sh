#!/bin/bash
# Start the application in Development Mode

# 1. Start Backend
echo "Starting Backend..."
# Creating a new terminal tab/process for backend if possible, or backgrounding it
cd backend/backend
npm install
# Start in background
npm run start:dev & 
BACKEND_PID=$!

echo "Backend starting on port 3001..."
sleep 5

# 2. Start Frontend
cd ../../frontend/doctor-finder-app
npm install
echo "Starting Frontend on port 3000..."
npm run dev

# Cleanup when frontend is stopped
kill $BACKEND_PID
