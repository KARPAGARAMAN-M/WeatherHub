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
import { Settings, CloudSun } from 'lucide-react';

function DashboardContent() {
  const { currentWeather, forecast, pollution, loading, error, refetch } = useWeather();
  const { setIsSettingsOpen } = useWeatherContext();

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '0 1.25rem 4rem 1.25rem',
        maxWidth: '1180px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Dynamic Header */}
      <Header onRefresh={refetch} />

      {/* Dashboard Main Content */}
      {loading ? (
        <WeatherLoader />
      ) : error && !currentWeather ? (
        <WeatherError message={error} onRetry={refetch} />
      ) : !currentWeather ? (
        <div
          className="surface-card animate-fadeIn"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            marginTop: '1.5rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--badge-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px var(--color-primary-glow)',
            }}
          >
            <CloudSun size={36} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              🌤 Welcome to WeatherHub
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', maxWidth: '460px', lineHeight: '1.6' }}>
              Search for any city or click a saved location to experience the live weather forecast and dynamic theme transitions.
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setIsSettingsOpen(true)}
            style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Settings size={18} /> Open Settings
          </button>
        </div>
      ) : (
        <main>
          {/* Main Weather Hero Card */}
          <WeatherHero currentWeather={currentWeather} />

          {/* Weather Details & Metrics Grid */}
          <WeatherMetrics currentWeather={currentWeather} />

          {/* Hourly Timeline & 7-Day Forecast */}
          <ForecastSection forecastData={forecast} timezoneOffset={currentWeather?.timezone} />

          {/* Air Quality Index Gauge */}
          <AirQualityCard pollutionData={pollution} />

          {/* Saved Places Grid */}
          <PlacesGrid />
        </main>
      )}

      {/* Settings Modal */}
      <ApiKeyModal />

      {/* Clean Premium Footer */}
      <footer
        style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--card-border)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <p style={{ fontWeight: '600', color: 'var(--color-text)' }}>
          WeatherHub • Dynamic Premium Weather Dashboard
        </p>
        <p style={{ fontSize: '0.78rem', opacity: 0.7 }}>
          Powered by OpenWeather & React • Real-Time Dynamic Theme Engine
        </p>
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
