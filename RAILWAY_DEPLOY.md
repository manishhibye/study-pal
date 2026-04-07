# Railway Deployment Guide

## Prerequisites
1. **Railway account** → [railway.app](https://railway.app)
2. **GitHub account** with this repo pushed
3. **MongoDB Atlas** account (already configured in `.env`)

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Authorize Railway to access your GitHub

### 3. Configure Environment Variables
1. In Railway project dashboard, click **Variables**
2. Click **Raw Editor** and paste your `.env` values:
```
MONGODB_URI=mongodb+srv://tm745242_db_user:WYMXmrHZa12xA4K4@cluster0.safbber.mongodb.net/studypal?appName=Cluster0
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=AIzaSyAQ2QAg-aCVq2NsBa3wpw0M3qzuYOqDHb8
```

### 4. Deploy
1. Railway auto-detects the `Procfile`
2. Click **Deploy** button
3. Monitor logs in the **Deployments** tab

### 5. Test Your Deployment
- Railway provides a public URL (e.g., `https://study-companion-prod.railway.app`)
- Test API: `curl https://your-url/api/health`
- Frontend automatically served at root URL

## What Happens on Deploy
1. Railway reads `Procfile` → runs `cd backend && npm start`
2. Backend `postinstall` script runs:
   - Installs frontend dependencies
   - Builds frontend (`vite build` → `frontend/dist`)
3. Backend serves `frontend/dist` as static files
4. MongoDB connection uses `MONGODB_URI` from environment variables

## Troubleshooting

### "Frontend not found" or 404 errors
- Check: `frontend/dist/index.html` exists
- Deploy logs should show build output
- If failed, check frontend build errors in logs

### API calls failing
- Verify `MONGODB_URI` is set correctly in Railway variables
- Check MongoDB Atlas network access includes Railway IPs (usually allow all for testing)
- Review deployment logs for connection errors

### Port conflicts  
- Railway automatically assigns `PORT` via environment variable
- No need to hardcode port numbers

## Security Note
⚠️ **NEVER commit `.env` to GitHub**
- `.env` is in `.gitignore` (already added)
- Always set variables in Railway dashboard, not in code
- Use `.env.example` with placeholder values only

## Rollback
If deployment fails:
1. Railway keeps previous versions
2. Click **Deployments** tab → select previous version → **Redeploy**
