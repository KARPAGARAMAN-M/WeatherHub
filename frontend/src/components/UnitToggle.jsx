import React from 'react';
import { useWeatherContext } from '../context/WeatherContext';

export default function UnitToggle() {
  const { unit, toggleUnit } = useWeatherContext();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '9999px',
        padding: '3px',
        cursor: 'pointer',
      }}
      onClick={toggleUnit}
      title="Toggle Temperature Unit (°C / °F)"
    >
      <button
        type="button"
        style={{
          background: unit === 'C' ? 'var(--color-primary)' : 'transparent',
          color: unit === 'C' ? '#1a1a1a' : '#fff',
          border: 'none',
          borderRadius: '9999px',
          padding: '4px 10px',
          fontWeight: '700',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        °C
      </button>
      <button
        type="button"
        style={{
          background: unit === 'F' ? 'var(--color-primary)' : 'transparent',
          color: unit === 'F' ? '#1a1a1a' : '#fff',
          border: 'none',
          borderRadius: '9999px',
          padding: '4px 10px',
          fontWeight: '700',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        °F
      </button>
    </div>
  );
}
