import React, { useState } from 'react';
import { CloudSun, Navigation, Settings, RefreshCw } from 'lucide-react';
import SearchBar from './SearchBar';
import { useWeatherContext } from '../context/WeatherContext';

export default function Header({ onRefresh }) {
  const { setActiveCity, setIsSettingsOpen, unit, toggleUnit, apiKey } = useWeatherContext();
  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const params = new URLSearchParams({ lat: latitude, lon: longitude });
          if (apiKey) params.append('apiKey', apiKey);

          const res = await fetch(`/api/weather/current?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            setActiveCity({
              name: data.name || 'Current Location',
              state: data.state || '',
              country: data.sys?.country || '',
              lat: latitude,
              lon: longitude,
            });
          } else {
            setActiveCity({
              name: 'Current Location',
              lat: latitude,
              lon: longitude,
            });
          }
        } catch (e) {
          setActiveCity({
            name: 'Current Location',
            lat: latitude,
            lon: longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        alert('Could not retrieve your location. Please check browser permissions.');
        setIsLocating(false);
      }
    );
  };

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem 0 0.5rem 0',
        marginBottom: '1rem',
        position: 'relative',
        zIndex: 100,
        overflow: 'visible',
      }}
    >
      {/* Top Main Header Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          position: 'relative',
          zIndex: 200,
          overflow: 'visible',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1.5px solid var(--card-border)',
              backdropFilter: 'blur(12px)',
              padding: '10px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px var(--color-primary-glow)',
            }}
          >
            <CloudSun size={26} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.035em' }}>
              Weather<span style={{ color: 'var(--color-primary)' }}>Hub</span>
            </h1>
          </div>
        </div>

        {/* Center Search Bar */}
        <div
          style={{
            flex: '1 1 300px',
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '520px',
            position: 'relative',
            zIndex: 1000,
          }}
        >
          <SearchBar />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* Unit Toggle Button */}
          <button
            type="button"
            className="btn-ghost"
            onClick={toggleUnit}
            title={`Switch temperature unit to °${unit === 'C' ? 'F' : 'C'}`}
            style={{ fontWeight: '800', padding: '6px 14px', fontSize: '0.9rem' }}
          >
            °{unit}
          </button>

          {/* Location Detect */}
          <button
            type="button"
            className="btn-icon"
            onClick={handleGeolocation}
            disabled={isLocating}
            title="Detect my current location"
          >
            <Navigation size={18} className={isLocating ? 'animate-spin' : ''} />
          </button>

          {/* Refresh */}
          {onRefresh && (
            <button
              type="button"
              className="btn-icon"
              onClick={onRefresh}
              title="Refresh weather data"
            >
              <RefreshCw size={18} />
            </button>
          )}

          {/* Settings */}
          <button
            type="button"
            className="btn-icon"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings & API Key"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

