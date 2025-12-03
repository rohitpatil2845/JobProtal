#!/bin/bash

echo "========================================"
echo "Job Portal - Automated Setup Script"
echo "========================================"
echo ""

echo "[1/5] Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your MySQL credentials"
    read -p "Press enter to continue..."
fi

echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

echo ""
echo "[2/5] Setting up Frontend..."
cd frontend

if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "[3/5] Creating MySQL Database..."
read -p "Enter MySQL username (default: root): " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-root}

read -sp "Enter MySQL password: " MYSQL_PASS
echo ""

echo "Creating database 'job_portal'..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" -e "CREATE DATABASE IF NOT EXISTS job_portal;"
if [ $? -ne 0 ]; then
    echo "⚠️  Failed to create database. Please create it manually."
    echo "Run: CREATE DATABASE job_portal;"
fi

echo ""
echo "[4/5] Setup Complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo ""
echo "1. Edit backend/.env with your MySQL credentials:"
echo "   - DB_USER=$MYSQL_USER"
echo "   - DB_PASSWORD=your_password"
echo "   - DB_NAME=job_portal"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open your browser:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "========================================"
echo ""

read -p "Do you want to start the servers now? (y/n): " START
if [ "$START" = "y" ] || [ "$START" = "Y" ]; then
    echo ""
    echo "Starting servers..."
    echo "Backend will run in this terminal"
    echo "Frontend will open in a new terminal"
    echo ""
    
    # Start frontend in background
    osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/frontend\" && npm run dev"' 2>/dev/null || \
    gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash" 2>/dev/null || \
    xterm -e "cd frontend && npm run dev" 2>/dev/null || \
    (cd frontend && npm run dev &)
    
    # Start backend in current terminal
    cd backend
    npm run dev
else
    echo ""
    echo "✅ Setup complete! Run the servers manually when ready."
fi
