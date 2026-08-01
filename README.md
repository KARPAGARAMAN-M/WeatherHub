# WeatherHub 🌤️ • Professional Meteorological Platform & Interactive Weather Dashboard

A state-of-the-art, full-stack weather application built with a modern glassmorphism UI, real-time meteorological calculations, dynamic particle animation background engine, interactive live radar map, severe weather alert system, photography hour tracking (Golden/Blue hours), side-by-side city comparison tool, and printable PDF weather report generator.

---

## ✨ Features Checklist

### 1. 🏠 Home Page & Global Search
- **Worldwide Search Bar**: Autocomplete search supporting City, Town, Village, District, State, Country, Postal Code, and Coordinates ($Lat, Lon$).
- **Hierarchical Suggestions**: Displays `City, District/State, Country` (e.g. *Los Angeles, Los Angeles County, California, United States*).
- **Recent Searches & History**: Saves recent location searches locally.
- **GPS Location Detection**: High-accuracy browser geolocation with permission fallback & automatic weather lookup on startup.

### 2. 🌤 Exact Meteorological Current Weather
- Displays 100% exact meteorological conditions (*Clear Sky*, *Scattered Clouds*, *Light Intensity Drizzle*, *Thunderstorm with Heavy Rain*, *Freezing Rain*, *Mist*, *Fog*).
- **Core Parameters**: Temperature (with smooth number transition animation), Feels Like, High/Low, Humidity %, Pressure (hPa), Visibility (km), UV Index, Wind Speed & Gusts, Wind Direction (exact degrees & 16-point cardinal N, NNE, NE...), Dew Point ($T_d$), Cloud Cover %, Sunrise, Sunset, Moon Phase, Coordinates ($Lat, Lon$), Station Elevation ($m$), Local Time & Indian Standard Time (IST).

### 3. ⏱ 24-Hour Hourly Timeline
- Horizontal snap-scroll timeline displaying 24 consecutive hours with Time, Animated Weather Icon, Temperature, Rain Chance %, Wind Speed, and Humidity.

### 4. 📅 7-Day Forecast
- 7-day outlook displaying Day Name (*Today, Tomorrow, Weekday*), Date, Weather Icon, Min Temp, Max Temp, Condition Description, and temperature range visualization bar.

### 5. 📊 Environmental Details Grid
- Dedicated cards for **Humidity**, **Pressure**, **Wind & Gusts**, **UV Index**, **Visibility**, **Air Quality Index (AQI)**, **Cloud Coverage**, **Feels Like**, **Dew Point**, **Coordinates & Elevation**, and **Moon Phase**.

### 6. 💨 Air Quality Index (AQI) & Pollutants
- Multi-color gauge scale (Levels 1 to 5: *Good, Fair, Moderate, Poor, Very Poor, Hazardous*).
- Breakdown for $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{O}_3$, $\text{CO}$, $\text{NO}_2$, and $\text{SO}_2$ with safety advisories.

### 7. 🗺 Interactive Live Weather Map & Radar
- Layer selection modal (`InteractiveMapModal`) supporting:
  - 🌡 Temperature Map
  - 🌧 Precipitation / Rain Layer
  - ☁ Cloud Coverage
  - 💨 Wind Speed Vector
  - 📡 Live Weather Radar

### 8. 🚨 Severe Weather Alerts
- Real-time severe weather alert banner (`WeatherAlertsBanner`) for *Thunderstorm*, *Heavy Rainfall*, *Extreme Heat Wave*, *Gale Winds*, *Dense Fog*, *Flooding*, and *Snow Warnings* with Severity badges, Description, and Safety tips.

### 9. ❤️ Saved Favorite Locations
- Save/Unsave bookmark grid (`PlacesGrid`) displaying live temperature, weather icon, high/low range, and quick selection.

### 10. ⚙ Settings & Customization
- **Temperature Unit**: Celsius (°C) / Fahrenheit (°F) toggle.
- **Startup Geolocation**: Auto-detect location on launch preference.
- **OpenWeather API Key**: Optional custom API key with automatic fallback to live Open-Meteo & dynamic mock generators when no key is entered.

### 11. 🎨 Dynamic Animated Weather Backgrounds
- Canvas particle engine rendering live animated weather effects:
  - ☀️ **Sunny**: Floating light particles & ambient golden glow.
  - 🌧 **Rainy**: Falling rain droplets + ground ripple physics.
  - ❄️ **Snowy**: Drifting snowflakes.
  - 🌩 **Thunderstorm**: Lightning flashes & storm atmosphere.
  - 🌌 **Night**: Starry night canvas.
  - 🌅 **Sunrise / Sunset**: Radiant color gradients.

### 12. 🚴 Lifestyle, Health & Activity Analytics
- 👔 **Clothing Suggestions**: Outfit recommendations based on temp, wind & rain.
- ☂️ **Umbrella Advisory**: *Required*, *Keep Handy*, or *Not Needed*.
- 🚗 **Driving Conditions**: *Optimal*, *Drive with Caution*, or *Hazardous Driving*.
- 🏃 **Outdoor Activity Suitability (1-10)**: Running, Cycling, Beach/Swimming, Stargazing.
- 🌸 **Pollen & Allergen Index**: Low, Moderate, or High pollen risk.
- 🩺 **Health Recommendations**: UV Sun Protection, Hydration Alerts, Cold Protection, and Respiratory Mask Warnings.

### 13. 📸 Photography Hours & Celestial Tracker
- 🌅 **Morning Golden Hour**: Sunrise to Sunrise + 60 mins
- 🌇 **Evening Golden Hour**: Sunset - 60 mins to Sunset
- 📷 **Evening Blue Hour**: Sunset + 10 mins to Sunset + 30 mins
- 🌙 **Lunar Tracker**: Moon Phase name, illumination %, and lunar age in days.

### 14. 🔄 City Comparison & 📄 PDF Report Generator
- **City Comparison Tool**: Compare 2 global cities side-by-side across Temperature, Humidity, Wind, Pressure, AQI, and Visibility.
- **Export / Print Weather Report**: Printable official Weather Summary Report PDF.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 8, Lucide Icons, Recharts, Vanilla CSS (Glassmorphism & Tokens)
- **Backend**: Java 21, Spring Boot 3, RestTemplate, UriComponentsBuilder, Maven
- **External Data APIs**: OpenWeatherMap API, Open-Meteo Forecast & Air Quality APIs (No Key Required Fallback), OpenStreetMap Embed

---

## 📁 Project Structure

```
WeatherHub/
├── frontend/                  # React + Vite frontend application
│   ├── src/
│   │   ├── components/        # Glassmorphic UI components & Modals
│   │   ├── context/           # Weather & Theme context state
│   │   ├── hooks/             # Custom hooks (useWeather, useGeocoding, useDebounce)
│   │   ├── utils/             # Meteorological calculations, formatting, themes
│   │   ├── App.jsx            # Main dashboard layout
│   │   └── index.css          # Design system CSS tokens & glassmorphism
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Spring Boot Java REST API backend proxy
│   ├── src/main/java/com/weatherhub/
│   │   ├── config/            # CORS configuration
│   │   ├── controller/        # Weather REST Controller (/api/weather)
│   │   ├── service/           # OpenWeather & Open-Meteo Service
│   │   └── WeatherHubApplication.java
│   └── pom.xml
│
├── docker-compose.yml         # Full-stack container orchestration
├── HOSTING.md                 # Deployment & Cloud Hosting Guide
├── render.yaml                # Render Blueprint setup
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 21+ & Maven (for backend)

### 1. Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run Backend Locally

```bash
cd backend
mvn spring-boot:run
```
The Spring Boot proxy starts on [http://localhost:8080](http://localhost:8080).

### 3. Run with Docker Compose

```bash
docker compose up -d --build
```

---

## 🌐 Deployment & Hosting

See the comprehensive [HOSTING.md](HOSTING.md) guide for 1-click Render Blueprint, Vercel, Railway, AWS, and VPS deployment instructions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
