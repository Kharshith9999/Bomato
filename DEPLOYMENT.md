# 🚀 Deployment Guide

## Quick Deploy Options

### 1. Vercel (Frontend) - FREE
Deploy your Next.js frontend in 2 minutes:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com)

### 2. Railway (Backend) - FREE Tier
Deploy your Express backend:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. MongoDB Atlas (Database) - FREE Tier
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update your environment variables

### 4. Redis (Upstash) - FREE Tier
1. Go to [upstash.com](https://upstash.com)
2. Create a free Redis database
3. Get your Redis URL
4. Update environment variables

## Environment Variables Setup

Create `.env` files with real values:

### Backend (.env)
```env
# Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bomato

# Get from Upstash Redis
REDIS_URL=redis://username:password@host:port

# Generate strong secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-different-refresh-secret-here

# Optional: Get from Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## One-Click Deployment Links

- **Frontend on Vercel**: https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme
- **Backend on Railway**: https://railway.app/new/template
- **Database on MongoDB Atlas**: https://cloud.mongodb.com/atlas/register

## Share with Friends

Once deployed, share your live URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- GitHub: `https://github.com/Kharshith9999/Bomato`