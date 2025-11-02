# 🌐 ESP32 IoT Dashboard with Telegram Alerts

A full-stack IoT monitoring system featuring real-time sensor data visualization, cloud storage, and intelligent Telegram notifications.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Project Overview

This system integrates ESP32 microcontroller sensors with a modern web dashboard and automated alert system, perfect for smart home, agriculture, or industrial monitoring applications.

### ✨ Key Features

- 🔌 **ESP32 Sensor Integration** - Temperature (DHT22), Humidity, PIR motion sensor
- 📊 **Real-time Web Dashboard** - Interactive charts and 3D visualizations using React
- 📱 **Telegram Alerts** - Instant notifications when thresholds are exceeded
- 💾 **Cloud Database** - MongoDB on Render for historical data storage
- 🔐 **Secure API** - API Key authentication for ESP32-server communication
- 📈 **Data Analytics** - Time-series graphs with Chart.js
- 🌐 **WebSocket Support** - Real-time data updates without polling
- 🎨 **3D Visualization** - Interactive Three.js sensor visualization
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔧 **Scalable Design** - Easy to add more sensors in future

---

## 🏗️ System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   ESP32     │ ──HTTP──│  Node.js     │ ────────│  Database   │
│  + Sensors  │         │   Backend    │         │  (Render)   │
└─────────────┘         └──────┬───────┘         └─────────────┘
                               │
                    ┌──────────┼──────────┐
                    │                     │
              ┌─────▼─────┐         ┌────▼─────┐
              │   React   │         │ Telegram │
              │ Dashboard │         │   Bot    │
              └───────────┘         └──────────┘
```

---

## 🛠️ Technology Stack

| Component         | Technology                           |
|-------------------|--------------------------------------|
| Microcontroller   | ESP32 (Arduino Framework)            |
| Backend           | Node.js + Express                    |
| Database          | PostgreSQL/MongoDB (Render)          |
| Frontend          | React + Chart.js + Three.js          |
| Notifications     | Telegram Bot API                     |
| Deployment        | Render (Backend), Vercel (Frontend)  |

---

## 📂 Project Structure

```
Mini-Anveshana_2025-26/
├── esp32-firmware/          # ESP32 Arduino code
│   ├── main.ino
│   ├── config.h
│   └── sensors.h
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── services/
│   ├── package.json
│   └── server.js
├── frontend/                # React Dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── docs/                    # Documentation
    ├── API.md
    ├── DEPLOYMENT.md
    └── TELEGRAM_SETUP.md
```

---

## 🚀 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 3️⃣ ESP32 Setup

1. Open `esp32-firmware/main.ino` in Arduino IDE
2. Install required libraries (WiFi, HTTPClient, ArduinoJson)
3. Configure WiFi credentials in `config.h`
4. Upload to ESP32

### 4️⃣ Telegram Bot Setup

1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Add token to backend `.env` file
4. Start bot with `/start` command

---

## 📊 Features Breakdown

### ESP32 Capabilities (Current)
- ✅ DHT22 Temperature & Humidity sensor
- ✅ PIR Motion detection
- ✅ JSON-formatted data transmission
- ✅ Automatic WiFi reconnection
- ✅ Configurable update intervals
- ✅ Serial monitoring for debugging
- 🔜 Additional sensors ready to add (gas, soil moisture, etc.)

### Backend API
- ✅ RESTful API endpoints
- ✅ Real-time data processing
- ✅ Threshold-based alert triggers
- ✅ Historical data queries with pagination
- ✅ API Key authentication
- ✅ Rate limiting & security (Helmet, CORS)
- ✅ WebSocket server for live updates
- ✅ MongoDB with automatic data expiration

### Frontend Dashboard
- ✅ Real-time data updates via WebSocket
- ✅ Interactive charts with Chart.js
- ✅ 3D sensor visualization with Three.js
- ✅ Responsive design (Mobile-friendly)
- ✅ Live connection status indicator
- ✅ Alert notifications
- ✅ Historical data graphs

### Telegram Bot
- ✅ Instant threshold alerts
- ✅ Command-based data queries (`/status`, `/config`)
- ✅ Multi-user subscriptions
- ✅ Subscribe/unsubscribe functionality
- ✅ Configurable alert thresholds
- ✅ Emoji-rich notifications

---

## 🔐 Security Features

- 🔒 API Key authentication for ESP32
- 🔒 JWT tokens for web dashboard
- 🔒 Environment variable protection
- 🔒 HTTPS/TLS encryption
- 🔒 SQL injection prevention
- 🔒 Rate limiting on API endpoints

---

## 📈 Future Enhancements

- [ ] Machine Learning predictions
- [ ] Mobile app (React Native)
- [ ] LoRa integration for remote areas
- [ ] Multi-language support
- [ ] Voice alerts (Alexa/Google Home)
- [ ] Advanced analytics dashboard

---

## 📸 Screenshots

_Coming Soon_

---

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- ESP32 Community
- Arduino Framework
- Chart.js & Three.js teams
- Telegram Bot API

---

⭐ **Star this repo if you find it useful!**
