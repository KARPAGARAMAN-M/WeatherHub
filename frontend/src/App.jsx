import React, { useState } from 'react';
import { WeatherProvider, useWeatherContext } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import { useWeather } from './hooks/useWeather';
import Header from './components/Header';
import WeatherAlertsBanner from './components/WeatherAlertsBanner';
import WeatherHero from './components/WeatherHero';
import WeatherMetrics from './components/WeatherMetrics';
import ForecastSection from './components/ForecastSection';
import AirQualityCard from './components/AirQualityCard';
import SunMoonTracker from './components/SunMoonTracker';
import LifestyleHealthGrid from './components/LifestyleHealthGrid';
import PlacesGrid from './components/PlacesGrid';
import WeatherEffects from './components/WeatherEffects';
import ApiKeyModal from './components/ApiKeyModal';
import InteractiveMapModal from './components/InteractiveMapModal';
import CityComparisonModal from './components/CityComparisonModal';
import ExportReportModal from './components/ExportReportModal';
import { WeatherLoader, WeatherError } from './components/Loader';
import { Settings, CloudSun } from 'lucide-react';

function DashboardContent() {
  const { currentWeather, forecast, pollution, loading, error, refetch } = useWeather();
  const { setIsSettingsOpen } = useWeatherContext();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

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
      <Header
        onRefresh={refetch}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        currentWeather={currentWeather}
      />

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
          {/* Weather Alerts Banner (Checklist #8) */}
          <WeatherAlertsBanner currentWeather={currentWeather} />

          {/* Main Weather Hero Card (Checklist #2) */}
          <WeatherHero currentWeather={currentWeather} />

          {/* Weather Details & Metrics Grid (Checklist #2, #5) */}
          <WeatherMetrics currentWeather={currentWeather} pollutionData={pollution} />

          {/* Hourly Timeline & 7-Day Forecast (Checklist #3, #4) */}
          <ForecastSection
            forecastData={forecast}
            timezoneOffset={currentWeather?.timezone}
            currentWeather={currentWeather}
          />

          {/* Air Quality Index Gauge & Pollutant Breakdown (Checklist #6) */}
          <AirQualityCard pollutionData={pollution} />

          {/* Celestial Sun & Moon Tracker (Checklist #2, #21) */}
          <SunMoonTracker currentWeather={currentWeather} />

          {/* Lifestyle, Health & Activity Suggestions (Checklist #13) */}
          <LifestyleHealthGrid currentWeather={currentWeather} pollutionData={pollution} />

          {/* Saved Places Grid (Checklist #9) */}
          <PlacesGrid />
        </main>
      )}

      {/* Modals & Dialogs */}
      <ApiKeyModal />

      <InteractiveMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      <CityComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentWeather={currentWeather}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentWeather={currentWeather}
        forecast={forecast}
        pollution={pollution}
      />

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
          WeatherHub • Dynamic Professional Weather Platform
        </p>
        <p style={{ fontSize: '0.78rem', opacity: 0.7 }}>
          Powered by Real-Time Meteorological Engine & React • Dynamic Live Themes
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
