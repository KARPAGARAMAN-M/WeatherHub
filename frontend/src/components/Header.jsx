import React, { useState } from 'react';
import { CloudSun, Navigation, Key, Sparkles, RefreshCw } from 'lucide-react';
import SearchBar from './SearchBar';
import UnitToggle from './UnitToggle';
import { useWeatherContext } from '../context/WeatherContext';

export default function Header({ onRefresh }) {
  const { setActiveCity, isDemoMode, setIsKeyModalOpen } = useWeatherContext();
  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setActiveCity({
          name: 'Current Location',
          lat: latitude,
          lon: longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        alert('Could not retrieve your location. Please check your browser permissions.');
        setIsLocating(false);
      }
    );
  };

  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.2rem 0',
        marginBottom: '1.5rem',
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
            padding: '10px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--color-primary)',
          }}
        >
          <CloudSun size={28} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1.1 }}>
            Weather<span style={{ color: 'var(--color-primary)' }}>Hub</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Live Predictions & Visual Metrics
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
        <SearchBar />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Geolocation Button */}
        <button
          type="button"
          className="btn-glass"
          onClick={handleGeolocation}
          disabled={isLocating}
          title="Auto-detect weather at my location"
        >
          <Navigation size={16} className={isLocating ? 'animate-spin' : ''} />
          <span className="hide-mobile">Near Me</span>
        </button>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            className="btn-glass"
            onClick={onRefresh}
            title="Refresh Weather Data"
          >
            <RefreshCw size={16} />
          </button>
        )}

        {/* Unit Switcher */}
        <UnitToggle />

        {/* Key Settings Button / Demo Badge */}
        <button
          type="button"
          className="btn-glass"
          onClick={() => setIsKeyModalOpen(true)}
          style={{
            borderColor: isDemoMode ? 'rgba(255, 213, 79, 0.5)' : 'rgba(255,255,255,0.3)',
          }}
          title={isDemoMode ? 'Click to add OpenWeather API Key' : 'API Key Settings'}
        >
          {isDemoMode ? (
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
          ) : (
            <Key size={16} />
          )}
          <span className="hide-mobile">{isDemoMode ? 'Demo Mode' : 'Key Set'}</span>
        </button>
      </div>
    </header>
  );
}
