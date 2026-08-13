import React, { useState } from 'react';
import { CloudSun, Navigation, Settings, RefreshCw, Layers, ArrowRightLeft, FileText, ShieldAlert } from 'lucide-react';
import SearchBar from './SearchBar';
import { useWeatherContext } from '../context/WeatherContext';
import { generateSevereAlerts } from '../utils/lifestyleCalc';

export default function Header({ onRefresh, onOpenMap, onOpenCompare, onOpenExport, currentWeather }) {
  const { setActiveCity, setIsSettingsOpen, unit, toggleUnit, apiKey, detectCurrentLocation, locationStatus } = useWeatherContext();

  const alerts = generateSevereAlerts(currentWeather);
  const alertCount = alerts.length;

  const isLocating = locationStatus === 'detecting';

  const handleGeolocation = async () => {
    await detectCurrentLocation({ isManualClick: true });
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

        {/* Action Controls & Navigation Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
          {/* Weather Map Modal Button */}
          <button
            type="button"
            className="btn-ghost"
            onClick={onOpenMap}
            title="Open Interactive Live Radar & Weather Map"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <Layers size={16} /> <span className="hide-mobile">Live Map</span>
          </button>

          {/* City Comparison Button */}
          <button
            type="button"
            className="btn-ghost"
            onClick={onOpenCompare}
            title="Compare Weather Between Cities"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <ArrowRightLeft size={16} /> <span className="hide-mobile">Compare</span>
          </button>

          {/* Export / Print PDF Report */}
          <button
            type="button"
            className="btn-ghost"
            onClick={onOpenExport}
            title="Download Weather Summary Report (PDF/Print)"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <FileText size={16} /> <span className="hide-mobile">Report</span>
          </button>

          {/* Unit Toggle Button */}
          <button
            type="button"
            className="btn-ghost"
            onClick={toggleUnit}
            title={`Switch temperature unit to °${unit === 'C' ? 'F' : 'C'}`}
            style={{ fontWeight: '800', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            °{unit}
          </button>

          {/* Location Detect */}
          <button
            type="button"
            className="btn-icon"
            onClick={handleGeolocation}
            disabled={isLocating}
            title="Detect my current GPS location"
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
            title="Settings & Preferences"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
