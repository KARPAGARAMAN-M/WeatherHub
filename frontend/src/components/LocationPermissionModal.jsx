import React, { useState } from 'react';
import { Navigation, MapPin, ShieldCheck, X, Compass, CheckCircle2 } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

export default function LocationPermissionModal() {
  const { showLocationPromptModal, setShowLocationPromptModal, detectCurrentLocation, activeCity } = useWeatherContext();
  const [isDetecting, setIsDetecting] = useState(false);

  if (!showLocationPromptModal) return null;

  const handleEnableLocation = async () => {
    setIsDetecting(true);
    try {
      localStorage.setItem('weatherhub_startup_prompt_dismissed', 'true');
      const success = await detectCurrentLocation({ isManualClick: true });
      setShowLocationPromptModal(false);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleUseDefault = () => {
    localStorage.setItem('weatherhub_startup_prompt_dismissed', 'true');
    setShowLocationPromptModal(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 250ms ease both',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={handleUseDefault}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-text-secondary)' }}
          title="Dismiss location prompt"
        >
          <X size={18} />
        </button>

        {/* Icon Header */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem',
            boxShadow: '0 0 24px var(--color-primary-glow)',
          }}
        >
          <Navigation size={30} className={isDetecting ? 'animate-spin' : ''} />
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.65rem' }}>
          Enable Precise Local Weather
        </h2>

        {/* Description */}
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Allow location access to get accurate local weather forecasts, exact radar map coordinates, and real-time atmospheric alerts for your current location.
        </p>

        {/* Feature Highlights */}
        <div
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.75rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.82rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>High-accuracy GPS coordinate pinpointing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>Synchronized Live Map marker & weather alerts</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>No location data is ever stored on external servers</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleEnableLocation}
            disabled={isDetecting}
            style={{
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: '800',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <Navigation size={18} className={isDetecting ? 'animate-spin' : ''} />
            {isDetecting ? 'Detecting your location...' : 'Enable Location'}
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleUseDefault}
            disabled={isDetecting}
            style={{
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              width: '100%',
            }}
          >
            Use Default Location ({activeCity?.name || 'Chennai'})
          </button>
        </div>
      </div>
    </div>
  );
}
