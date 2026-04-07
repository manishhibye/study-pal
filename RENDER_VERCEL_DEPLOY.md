# Render + Vercel Deployment Guide

This setup deploys:
- **Backend (API)** → Render
- **Frontend (React + Vite)** → Vercel

---

## PART 1: Deploy Backend to Render

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub account

### 2. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub → Select `manishhibye/student-companion` repo
3. Fill in:
   - **Name:** `study-companion-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free (or paid if needed)

### 3. Add Environment Variables
In Render dashboard, go to **Environment** and add:
```
MONGODB_URI=mongodb+srv://tm745242_db_user:WYMXmrHZa12xA4K4@cluster0.safbber.mongodb.net/studypal?appName=Cluster0
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=AIzaSyAQ2QAg-aCVq2NsBa3wpw0M3qzuYOqDHb8
```

### 4. Deploy
- Click **Deploy**
- Wait for build to complete
- **Copy your Render URL** (e.g., `https://study-companion-backend.onrender.com`)
- Test: `curl https://your-render-url/api/health`

---

## PART 2: Deploy Frontend to Vercel

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub account

### 2. Add Project
1. Click **"Add New..."** → **"Project"**
2. Select `student-companion` repo
3. Choose **"Create a new team"** or use existing

### 3. Configure Build Settings
- **Framework Preset:** Vite
- **Root Directory:** `./frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 4. Add Environment Variables
In Vercel project settings, go to **Environment Variables** and add:
```
VITE_API_URL=https://study-companion-backend.onrender.com
```
(Replace with your actual Render backend URL)

### 5. Deploy
- Click **Deploy**
- Get your Vercel URL
- Frontend automatically rebuilds and proxies `/api` calls to Render

---

## How It Works

```
User Browser (Vercel)
       ↓
   React App
       ↓
   /api/subjects → (Vercel rewrites to Render)
       ↓
Backend on Render → MongoDB Atlas
```

All API calls from frontend transparently route to Render backend.

---

## Environment Variables Checklist

### Render Backend (.env)
- ✅ `MONGODB_URI` - MongoDB Atlas connection string
- ✅ `GEMINI_API_KEY` - Google Gemini API key
- ✅ `NODE_ENV=production`
- ✅ `PORT=3001`

### Vercel Frontend
- ✅ `VITE_API_URL` - Your Render backend URL

---

## Testing Deployment

### Test Backend
```bash
curl https://study-companion-backend.onrender.com/api/health
# Should return: {"status":"ok","database":"connected",...}
```

### Test Frontend
1. Visit your Vercel URL
2. Open Browser DevTools → Network tab
3. Try creating a subject or note
4. Verify API calls go to Render (check request URL)

---

## Troubleshooting

### "Cannot find module" or build fails
- Check `cd frontend && npm install` works locally
- Verify `build` script in [frontend/package.json](frontend/package.json)
- Check Vercel build logs for errors

### API calls return 404
- Ensure `VITE_API_URL` is set in Vercel
- Verify Render backend is running (check render.com dashboard)
- Test Render URL directly in browser

### CORS errors
- Render backend has CORS enabled in [backend/server.js](backend/server.js)
- Vercel rewrites `/api` calls directly (no CORS issues)

### Database connection fails
- Verify `MONGODB_URI` format is correct
- Check MongoDB Atlas network access allows Render IPs
- Test locally: `node backend/server.js` with same `MONGODB_URI`

---

## Updating Deployment

### Backend Changes
```bash
git add backend/
git commit -m "Update backend"
git push origin main
# Render auto-redeploys
```

### Frontend Changes
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
# Vercel auto-redeploys
```

---

## Cost Comparison

| Platform | Backend | Frontend | Cost |
|----------|---------|----------|------|
| **Railway** | Included | Included | $5-20/mo |
| **Render + Vercel** | Free (sleeps) | Free | $0-5/mo |
| **Heroku + Netlify** | Deprecated | Free | $5+/mo |

**Recommendation:** Render free tier works for hobby projects but sleeps after inactivity. Upgrade to paid ($7/mo) for 24/7 uptime.

