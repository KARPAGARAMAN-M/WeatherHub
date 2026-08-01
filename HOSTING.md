# WeatherHub Hosting & Deployment Guide

This guide details all options available to host **WeatherHub** in production, ranging from free cloud platform hosting (Render, Vercel, Railway) to self-hosted VPS servers with Docker Compose.

---

## 🚀 Deployment Options Overview

| Platform / Method | Frontend | Backend | Setup Effort | Recommended For |
| :--- | :--- | :--- | :--- | :--- |
| **Option A: Render Blueprint** | Render Static | Render Web (Docker) | ⭐ (1-Click) | Easiest zero-config full stack hosting |
| **Option B: Decoupled Hosting** | Vercel / Netlify | Railway / Render / Fly.io | ⭐⭐ (Low) | High performance global CDN frontend |
| **Option C: Docker Compose** | Nginx Container | Spring Boot Container | ⭐⭐⭐ (Medium) | Self-hosted VPS (AWS EC2, DigitalOcean, Hetzner) |

---

## 🌟 Option A: Hosting on Render (1-Click Blueprint)

[Render](https://render.com) provides free tier hosting for both Web Services and Static Sites.

### Step-by-Step Instructions:

1. **Push your repository to GitHub / GitLab**.
2. **Log into Render** and select **New +** -> **Blueprint**.
3. **Connect your Git repository**. Render will automatically read `render.yaml`.
4. **Set Environment Variables**:
   - For `weatherhub-backend`: set `OPENWEATHER_API_KEY` to your key from OpenWeatherMap.
   - For `weatherhub-frontend`: set `VITE_OPENWEATHER_API_KEY` to your OpenWeatherMap key.
5. Click **Apply**. Render will build and deploy both services automatically!

---

## ⚡ Option B: Vercel / Netlify (Frontend) + Railway / Render / Fly.io (Backend)

You can host the React frontend on Vercel/Netlify for fast global edge rendering, while hosting the Spring Boot Java backend on Railway or Render.

### 1. Deploying the Backend (Spring Boot):
- **On Railway**:
  - Connect your Git repo, point root directory to `/backend`.
  - Add variable `OPENWEATHER_API_KEY=your_api_key`.
  - Copy the generated backend domain URL (e.g. `https://weatherhub-backend.up.railway.app`).

- **On Render**:
  - Click **New Web Service**, choose Docker or Java runtime, set root directory to `backend`.
  - Set `OPENWEATHER_API_KEY=your_api_key`.
  - Copy the backend URL (e.g. `https://weatherhub-backend.onrender.com`).

### 2. Deploying the Frontend (Vercel / Netlify):
- **On Vercel**:
  1. Import project to Vercel, set **Root Directory** to `frontend`.
  2. Set **Framework Preset** to `Vite`.
  3. Add Environment Variables:
     - `VITE_OPENWEATHER_API_KEY` = `your_openweather_api_key`
     - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com` (your hosted backend URL from Step 1)
  4. Click **Deploy**.

---

## 🐳 Option C: Docker & Docker Compose (Self-Hosted VPS)

Deploy on any Cloud VPS (Ubuntu, Linux, AWS EC2, DigitalOcean Droplet, Linode) using Docker.

### Requirements:
- Docker & Docker Compose installed on server (`docker compose version`).

### Steps:

1. **Clone the repository on your server**:
   ```bash
   git clone https://github.com/your-username/WeatherHub.git
   cd WeatherHub
   ```

2. **Set Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

3. **Build & Start Containers**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify Running Services**:
   ```bash
   docker compose ps
   ```
   - Frontend available at: `http://<your-vps-ip>:80` or `http://<your-vps-ip>:5173`
   - Backend API available at: `http://<your-vps-ip>:8080/api/weather/current?city=London`

5. **Stop Containers**:
   ```bash
   docker compose down
   ```

---

## 🔑 Environment Variables Reference

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `OPENWEATHER_API_KEY` | Backend / Docker | OpenWeatherMap API Key | `a1b2c3d4...` |
| `VITE_OPENWEATHER_API_KEY` | Frontend | OpenWeatherMap API Key for client requests | `a1b2c3d4...` |
| `VITE_API_BASE_URL` | Frontend | Backend host URL (for cross-origin setup) | `https://api.weatherhub.com` |
| `PORT` | Backend | Port Spring Boot listens on (set dynamically by host) | `8080` |

---

## 🛠️ Common Troubleshooting

- **CORS Errors**: The backend `WebConfig.java` has been configured with `.allowedOriginPatterns("*")` to support cross-domain API calls automatically.
- **Dynamic Port Assignment**: `application.properties` uses `server.port=${PORT:8080}` to support platforms like Render/Heroku that assign dynamic ports.
- **SPA 404 on Refresh**: `frontend/nginx.conf` and `render.yaml` include rewrite rules to route all non-file requests to `index.html`.
