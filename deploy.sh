#!/bin/bash

echo "🚀 Starting E-commerce Project Deployment to Vercel"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Deployment Order:"
echo "1. Backend API"
echo "2. Frontend"
echo "3. Admin Panel"
echo ""

read -p "🔑 Have you configured all environment variables in Vercel dashboard? (y/n): " env_ready

if [ "$env_ready" != "y" ]; then
    echo "⚠️  Please configure environment variables first:"
    echo "   - Go to Vercel dashboard"
    echo "   - Add all environment variables from backend/.env"
    echo "   - Then run this script again"
    exit 1
fi

echo ""
echo "🔧 Step 1: Deploying Backend..."
cd backend
echo "Current directory: $(pwd)"
vercel --prod

echo ""
read -p "📝 Enter your backend URL (e.g., https://your-backend.vercel.app): " backend_url

if [ -z "$backend_url" ]; then
    echo "❌ Backend URL is required!"
    exit 1
fi

echo ""
echo "🔧 Step 2: Updating Frontend environment..."
cd ../frontend
echo "VITE_BACKEND_URL=$backend_url" > .env.production
echo "✅ Frontend environment updated"

echo ""
echo "🔧 Step 3: Deploying Frontend..."
vercel --prod

echo ""
echo "🔧 Step 4: Updating Admin environment..."
cd ../admin
echo "VITE_BACKEND_URL=$backend_url" > .env.production
echo "✅ Admin environment updated"

echo ""
echo "🔧 Step 5: Deploying Admin Panel..."
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo ""
echo "📋 Next Steps:"
echo "1. Update CORS settings in backend with your actual frontend/admin URLs"
echo "2. Test all functionality"
echo "3. Update payment callback URLs if needed"
echo ""
echo "🔗 Your deployed applications:"
echo "   Backend: $backend_url"
echo "   Frontend: (check Vercel dashboard)"
echo "   Admin: (check Vercel dashboard)"