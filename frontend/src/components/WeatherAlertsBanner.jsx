import React from 'react';
import { AlertTriangle, ShieldAlert, X, ChevronRight, Bell } from 'lucide-react';
import { generateSevereAlerts } from '../utils/lifestyleCalc';

export default function WeatherAlertsBanner({ currentWeather }) {
  const alerts = generateSevereAlerts(currentWeather);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="surface-card animate-slideUp"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '0.85rem',
            background: alert.badgeBg || 'rgba(239, 68, 68, 0.18)',
            border: `1.5px solid ${alert.color}80`,
            boxShadow: `0 8px 24px ${alert.color}25`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.1rem',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: alert.color,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 0 16px ${alert.color}`,
            }}
          >
            <ShieldAlert size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF' }}>
                  {alert.title}
                </h4>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: alert.color,
                    color: '#FFFFFF',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {alert.severity} Severity
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>
                {alert.time}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.95)', marginTop: '6px', lineHeight: '1.5' }}>
              {alert.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
