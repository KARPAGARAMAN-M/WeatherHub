import React from 'react';
import { WeatherProvider, useWeatherContext } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import { useWeather } from './hooks/useWeather';
import Header from './components/Header';
import WeatherHero from './components/WeatherHero';
import WeatherMetrics from './components/WeatherMetrics';
import ForecastSection from './components/ForecastSection';
import AirQualityCard from './components/AirQualityCard';
import PlacesGrid from './components/PlacesGrid';
import WeatherEffects from './components/WeatherEffects';
import ApiKeyModal from './components/ApiKeyModal';
import { WeatherLoader, WeatherError } from './components/Loader';
import { Sparkles, ExternalLink, Key } from 'lucide-react';

function DashboardContent() {
  const { currentWeather, forecast, pollution, loading, error, refetch } = useWeather();
  const { isDemoMode, setIsKeyModalOpen } = useWeatherContext();

  return (
    <div style={{ minHeight: '100vh', padding: '0 1rem 3rem 1rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <Header onRefresh={refetch} />

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div
          style={{
            background: 'rgba(255, 213, 79, 0.15)',
            border: '1px solid rgba(255, 213, 79, 0.35)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '10px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.85rem',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>
              <strong>Running in Demo Mode:</strong> Showing simulated weather data. Add your OpenWeather API key to get live satellite data worldwide.
            </span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsKeyModalOpen(true)}
            style={{ padding: '4px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            Add API Key
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <WeatherLoader />
      ) : error && !currentWeather ? (
        <WeatherError message={error} onRetry={refetch} />
      ) : (
        <main>
          {/* Top Row: Main Hero & Metrics */}
          <WeatherHero currentWeather={currentWeather} />
          <WeatherMetrics currentWeather={currentWeather} />

          {/* Forecast & AQI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <ForecastSection forecastData={forecast} timezoneOffset={currentWeather?.timezone} />
            <AirQualityCard pollutionData={pollution} />
          </div>

          {/* Multi-City Dashboard Places Grid */}
          <PlacesGrid />
        </main>
      )}

      {/* Settings Modal */}
      <ApiKeyModal />

      {/* Footer */}
      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
        <p>WeatherHub React Dashboard • Powered by OpenWeatherMap API & Vite</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <ThemeProvider>
        <WeatherEffects />
        <DashboardContent />
      </ThemeProvider>
    </WeatherProvider>
  );
}
