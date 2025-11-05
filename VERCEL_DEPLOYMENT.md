# 🚀 Deploy to Vercel (Recommended & FREE)

Vercel is the **best platform** for Next.js apps - created by the same team as Next.js!

## ⚡ One-Click Deployment

### **Option 1: Deploy via Vercel Website (Easiest)**
1. **Go to:** [vercel.com](https://vercel.com)
2. **Sign up** with GitHub (free)
3. **Click:** "New Project"
4. **Select:** `Kharshith9999/Bomato` repository
5. **Framework:** "Next.js" (auto-detected)
6. **Build Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
7. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend URL (optional for demo)
8. **Click:** "Deploy" 🎉

### **Option 2: Deploy via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Go to frontend directory
cd frontend

# Deploy
vercel --prod
```

### **Option 3: Connect GitHub Repository (Auto-Deploy)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import GitHub repository
4. Configure settings:
   - Root Directory: `frontend`
   - Framework Preset: Next.js
5. Enable automatic deployments
6. Every push to GitHub = automatic deployment!

## 🔧 Vercel Configuration

### **Environment Variables (Optional)**
Create these in Vercel dashboard → Settings → Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### **vercel.json (Optional)**
Create `frontend/vercel.json` for custom settings:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## 🎯 Benefits of Vercel

✅ **Perfect Next.js Support** - Created by Next.js team
✅ **Free Hosting** - Generous free tier
✅ **Auto HTTPS** - Free SSL certificates
✅ **Global CDN** - Fast worldwide
✅ **Preview Deployments** - Every PR gets a live preview
✅ **Automatic Scaling** - Handles traffic spikes
✅ **Custom Domains** - Free custom domain support
✅ **Edge Functions** - Serverless functions
✅ **Analytics** - Free performance analytics

## 📊 Free Tier Limits

- **100GB Bandwidth/month** (generous)
- **Unlimited Projects**
- **Unlimited Preview Deployments**
- **Unlimited Team Members**
- **Global CDN**
- **Custom Domains**
- **Edge Functions**

## 🚀 Your Live URLs

**Production URL:**
```
https://bomato.vercel.app
```
*(or whatever you choose during setup)*

**Preview URLs:**
```
https://bomato-branch-name-username.vercel.app
```

## 📱 What You Get

- Professional food delivery app
- Mobile-responsive design
- Fast loading with Vercel's CDN
- HTTPS security
- Auto-deployments from GitHub
- Preview environments for testing

## ⏰ Time to Deploy: 2-5 Minutes!

1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub
3. Select repository
4. Deploy!

Your Bomato app will be **live and shareable** in minutes! 🎉

---

**Why Vercel is Better than GitHub Pages for Next.js:**
- ✅ Built specifically for Next.js
- ✅ No export/convert needed
- ✅ Full Next.js features work
- ✅ Server-side rendering support
- ✅ API routes work
- ✅ Better performance
- ✅ Automatic optimizations