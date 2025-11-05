#!/bin/bash

# Bomato Quick Setup Script
# Run this to get started quickly!

echo "🍕 Setting up Bomato Food Delivery App..."

# Check if required tools are installed
echo "📋 Checking requirements..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install it from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your actual API keys!"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Create frontend .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating frontend .env.local file..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
EOF
    echo "⚠️  Please edit frontend/.env.local and add your actual API keys!"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Add your API keys to backend/.env and frontend/.env.local"
echo "2. Make sure MongoDB and Redis are running"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more details, read README.md"