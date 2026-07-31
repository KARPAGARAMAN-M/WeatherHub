import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function WeatherLoader() {
  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginTop: '1rem' }}>
      {/* Hero skeleton */}
      <div className="surface-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div className="skeleton" style={{ width: '220px', height: '32px', marginBottom: '14px' }} />
            <div className="skeleton" style={{ width: '180px', height: '16px', marginBottom: '24px' }} />
            <div className="skeleton" style={{ width: '200px', height: '80px', marginBottom: '14px' }} />
            <div className="skeleton" style={{ width: '160px', height: '18px' }} />
          </div>
          {/* WeatherIllustration right side skeleton */}
          <div className="skeleton" style={{ width: '300px', height: '200px', borderRadius: 'var(--radius-xl)' }} />
        </div>
      </div>

      {/* Metrics skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="skeleton" style={{ width: '70px', height: '12px' }} />
              <div className="skeleton" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
            </div>
            <div className="skeleton" style={{ width: '90px', height: '26px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '60px', height: '12px' }} />
          </div>
        ))}
      </div>

      {/* Forecast skeleton */}
      <div className="surface-card" style={{ padding: '1.75rem' }}>
        <div className="skeleton" style={{ width: '160px', height: '24px', marginBottom: '1.25rem' }} />
        <div style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="metric-card" style={{ minWidth: '130px', padding: '1.1rem 0.9rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ width: '55px', height: '14px', margin: '0 auto 12px' }} />
              <div className="skeleton" style={{ width: '46px', height: '46px', borderRadius: '50%', margin: '0 auto 12px' }} />
              <div className="skeleton" style={{ width: '50px', height: '22px', margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeatherError({ message, onRetry }) {
  return (
    <div
      className="surface-card animate-fadeIn"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        marginTop: '1.5rem',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(239, 68, 68, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
        }}
      >
        <AlertTriangle size={32} style={{ color: '#EF4444' }} />
      </div>
      <div>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--color-text)', marginBottom: '0.5rem', fontWeight: '800' }}>
          Unable to Load Weather Data
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', maxWidth: '420px', lineHeight: '1.5' }}>
          {message || 'Could not connect to the weather service. Please check your network connection or API settings.'}
        </p>
      </div>

      {onRetry && (
        <button type="button" className="btn-primary" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          <RefreshCw size={16} /> Retry Fetch
        </button>
      )}
    </div>
  );
}
