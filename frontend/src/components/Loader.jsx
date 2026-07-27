import React from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export function WeatherLoader() {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '300px',
      }}
    >
      <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
        Fetching live satellite weather data...
      </div>
    </div>
  );
}

export function WeatherError({ message, onRetry }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '2.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        borderColor: 'rgba(255, 107, 107, 0.4)',
      }}
    >
      <AlertTriangle size={48} style={{ color: '#ff6b6b' }} />
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.4rem' }}>
          Weather Data Unavailable
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: '400px' }}>
          {message || 'Unable to retrieve weather report for this city.'}
        </p>
      </div>

      {onRetry && (
        <button type="button" className="btn-primary" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          <RefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}
