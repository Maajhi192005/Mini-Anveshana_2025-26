# 🚀 GitHub Deployment Guide

Complete guide to deploy your ESP32 IoT project:
- **Backend** on Render (via GitHub)
- **Frontend** on GitHub Pages
- **ESP32** sending data to Render

---

## 📋 Prerequisites

- GitHub account
- Render account (free tier: https://render.com)
- ESP32 with sensors (DHT22, PIR)
- Git installed on your PC

---

## 🔧 Part 1: Setup GitHub Repository

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `esp32-iot-dashboard`
3. Description: `ESP32 IoT Dashboard with real-time sensor monitoring`
4. Choose **Public** (required for GitHub Pages)
5. Click **Create repository**

### Step 2: Push Your Code to GitHub

Open PowerShell in your project folder:

```powershell
cd "C:\Users\hp pc\Desktop\Mini-Anveshana_2025-26"

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: ESP32 IoT Dashboard"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/esp32-iot-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🖥️ Part 2: Deploy Backend to Render

### Step 1: Connect GitHub to Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Click **Connect GitHub** and authorize Render
4. Select your `esp32-iot-dashboard` repository

### Step 2: Configure Render Service

**Basic Settings:**
- **Name:** `esp32-iot-backend`
- **Region:** Select closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Advanced Settings (Environment Variables):**

Click **Add Environment Variable** and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `API_KEY` | `ESP32_SECURE_API_KEY_2025` |
| `JWT_SECRET` | `esp32-iot-jwt-secret-2025-secure-key-32chars` |
| `SESSION_SECRET` | `session-secret-key-esp32-iot-2025` |
| `FRONTEND_URL` | `https://YOUR_USERNAME.github.io/esp32-iot-dashboard` |
| `TELEGRAM_BOT_TOKEN` | *(leave empty or add your bot token)* |
| `TELEGRAM_CHAT_ID` | *(leave empty or add your chat ID)* |

**Instance Type:**
- Select **Free** (for testing)

### Step 3: Deploy

1. Click **Create Web Service**
2. Wait 2-3 minutes for deployment
3. Your backend URL will be: `https://esp32-iot-backend.onrender.com`

**⚠️ Important:** Copy this URL - you'll need it for ESP32 and frontend!

### Step 4: Test Backend

Visit: `https://esp32-iot-backend.onrender.com/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-11-02T...",
  "uptime": 123.45
}
```

---

## 🌐 Part 3: Deploy Frontend to GitHub Pages

### Step 1: Update Frontend Configuration

Edit `frontend/src/services/api.js`:

```javascript
// Change this line:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// To this (use your Render URL):
const API_URL = 'https://esp32-iot-backend.onrender.com';
```

### Step 2: Update Vite Config for GitHub Pages

Edit `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/esp32-iot-dashboard/', // Add this line with your repo name
  server: {
    port: 5173,
    host: true
  }
})
```

### Step 3: Build Frontend

```powershell
cd frontend
npm run build
```

This creates a `dist` folder with optimized files.

### Step 4: Deploy to GitHub Pages

**Option A: Using gh-pages (Recommended)**

```powershell
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "vite build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Option B: Manual Deployment**

1. Copy everything from `frontend/dist` folder
2. Go to your GitHub repository
3. Settings → Pages
4. Source: **Deploy from a branch**
5. Branch: Select `gh-pages` and `/root`
6. Save

### Step 5: Access Your Dashboard

Your frontend will be live at:
```
https://YOUR_USERNAME.github.io/esp32-iot-dashboard/
```

---

## 🔌 Part 4: Configure ESP32

### Update ESP32 Config

Edit `esp32-firmware/config.h`:

```cpp
// WiFi credentials
#define WIFI_SSID "Your_WiFi_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"

// Backend server on Render (IMPORTANT: Use your Render URL)
#define SERVER_URL "https://esp32-iot-backend.onrender.com/api/sensor-data"

// API Key (must match backend .env)
#define API_KEY "ESP32_SECURE_API_KEY_2025"

// Device ID
#define DEVICE_ID "ESP32_DHT22_PIR_001"
```

### Upload to ESP32

1. Open `esp32-firmware/main.ino` in Arduino IDE
2. Select **Board:** ESP32 Dev Module
3. Select **Port:** Your ESP32 COM port
4. Click **Upload**
5. Open Serial Monitor (115200 baud)

You should see:
```
✓ Connected to WiFi
✓ Sending sensor data...
✓ Server response: 201
```

---

## 🧪 Part 5: Test Everything

### Test Flow:

1. **ESP32** → Sends data to Render
2. **Render Backend** → Receives and processes data
3. **Frontend (GitHub Pages)** → Displays real-time data

### Test Steps:

1. **Check ESP32 Serial Monitor**
   - Should show "Server response: 201"

2. **Check Render Logs**
   - Go to Render dashboard → Logs
   - Should see "✓ Sensor data received from ESP32_DHT22_PIR_001"

3. **Check Frontend**
   - Open `https://YOUR_USERNAME.github.io/esp32-iot-dashboard/`
   - Should see temperature, humidity, motion data updating

4. **Test WebSocket (Real-time)**
   - Data should update automatically when ESP32 sends new readings

---

## 🔄 Making Updates

### Update Backend:

```powershell
git add backend/
git commit -m "Update backend"
git push
```

Render will automatically redeploy!

### Update Frontend:

```powershell
cd frontend
npm run build
npm run deploy
```

### Update ESP32:

Just re-upload the firmware in Arduino IDE.

---

## 🐛 Troubleshooting

### ESP32 Can't Connect

- ✅ Check WiFi credentials in `config.h`
- ✅ Verify Render URL is correct (no trailing slash)
- ✅ Check API_KEY matches backend

### Frontend Shows "No Data"

- ✅ Check browser console for errors (F12)
- ✅ Verify API_URL in `api.js` points to Render
- ✅ Check CORS settings in Render (FRONTEND_URL env var)

### Render Backend Not Working

- ✅ Check Render logs for errors
- ✅ Verify environment variables are set
- ✅ Test health endpoint: `/health`

### GitHub Pages 404 Error

- ✅ Check `base` in `vite.config.js` matches repo name
- ✅ Rebuild: `npm run build`
- ✅ Redeploy: `npm run deploy`

---

## 📊 System Architecture

```
┌─────────────┐
│   ESP32     │  (Hardware)
│  + DHT22    │  Sends HTTP POST every 30s
│  + PIR      │
└──────┬──────┘
       │ HTTPS
       ↓
┌──────────────────┐
│  Render Backend  │  (Node.js + Express)
│  - Receives data │  Stores in memory (no DB)
│  - WebSocket     │  Broadcasts to clients
│  - Telegram Bot  │  (optional)
└──────┬───────────┘
       │ WebSocket/REST API
       ↓
┌──────────────────┐
│ GitHub Pages     │  (React + Vite)
│ Frontend         │  Real-time dashboard
│ - Charts         │  3D visualization
│ - Alerts         │
└──────────────────┘
```

---

## 💡 Tips

1. **Free Tier Limits (Render):**
   - Free plan spins down after 15 min inactivity
   - First request after sleep takes ~30s
   - Upgrade to paid plan for 24/7 uptime

2. **Keep API Key Secure:**
   - Never commit `.env` to GitHub
   - Use Render environment variables

3. **Monitor Usage:**
   - Check Render dashboard for logs
   - Monitor ESP32 serial output

4. **Future Enhancements:**
   - Add database for historical data
   - Set up custom domain
   - Add user authentication

---

## ✅ Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Backend health check passes
- [ ] Frontend built successfully
- [ ] Frontend deployed to GitHub Pages
- [ ] ESP32 config updated with Render URL
- [ ] ESP32 firmware uploaded
- [ ] ESP32 sending data successfully
- [ ] Dashboard showing real-time data
- [ ] WebSocket connection working

---

## 🎉 Success!

Your ESP32 IoT Dashboard is now live on the internet!

- **Frontend:** `https://YOUR_USERNAME.github.io/esp32-iot-dashboard/`
- **Backend:** `https://esp32-iot-backend.onrender.com`
- **ESP32:** Sending data every 30 seconds

Share your dashboard link with anyone - it's accessible worldwide! 🌍
