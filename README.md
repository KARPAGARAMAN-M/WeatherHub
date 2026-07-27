# WeatherHub

Interactive weather dashboard with live OpenWeatherMap forecasts, search autocomplete, dynamic weather themes, air quality index, and multi-city tracking.

## Project Structure

```
WeatherHub/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── backend/           # Spring Boot (Java 21 / Maven) backend
│   ├── src/main/
│   │   ├── java/com/weatherhub/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   └── WeatherHubApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
│
└── .gitignore
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

### Backend

```bash
cd backend
mvn spring-boot:run   # Starts Spring Boot on http://localhost:8080
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Get a free API key at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
