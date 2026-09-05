import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Navigation, AlertCircle } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

export default function LocationToast() {
  const { locationToast, dismissToast, detectCurrentLocation } = useWeatherContext();

  useEffect(() => {
    if (!locationToast) return;
    // Do not auto dismiss loading detection toast while in progress
    if (locationToast.type === 'info' && locationToast.message.includes('Detecting')) {
      return;
    }

    return undefined;
  }, [locationToast, dismissToast]);

  if (!locationToast) return null;

  const { type, message, title } = locationToast;

  let borderColor = 'rgba(56, 189, 248, 0.4)';
  let bgGlow = 'rgba(56, 189, 248, 0.15)';
  let iconColor = '#38BDF8';
  let IconComponent = Info;

  if (type === 'success') {
    borderColor = 'rgba(34, 197, 94, 0.4)';
    bgGlow = 'rgba(34, 197, 94, 0.15)';
    iconColor = '#4ADE80';
    IconComponent = CheckCircle2;
  } else if (type === 'error') {
    borderColor = 'rgba(239, 68, 68, 0.4)';
    bgGlow = 'rgba(239, 68, 68, 0.15)';
    iconColor = '#F87171';
    IconComponent = AlertTriangle;
  } else if (type === 'warning') {
    borderColor = 'rgba(245, 158, 11, 0.4)';
    bgGlow = 'rgba(245, 158, 11, 0.15)';
    iconColor = '#FBBF24';
    IconComponent = AlertCircle;
  } else if (type === 'info' && message.includes('Detecting')) {
    IconComponent = Navigation;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        right: '16px',
        zIndex: 999999,
        maxWidth: '380px',
        width: 'calc(100vw - 32px)',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${bgGlow}`,
        padding: '0.75rem 0.9rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        animation: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <div
        style={{
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          background: bgGlow,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <IconComponent size={20} className={type === 'info' && message.includes('Detecting') ? 'animate-spin' : ''} />
      </div>

      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '2px' }}>
            {title}
          </h4>
        )}
        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={dismissToast}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 200ms ease',
        }}
        title="Close notification"
      >
        <X size={16} />
      </button>
      {type === 'error' && (
        <button
          type="button"
          onClick={() => detectCurrentLocation({ isManualClick: true })}
          style={{
            background: 'transparent',
            border: '1px solid var(--card-border)',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            padding: '5px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
