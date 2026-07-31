import React from 'react';
import { Wind, ShieldAlert } from 'lucide-react';
import { getAqiInfo } from '../utils/formatters';

export default function AirQualityCard({ pollutionData }) {
  if (!pollutionData?.list?.[0]) return null;

  const aqiItem = pollutionData.list[0];
  const aqiVal = aqiItem.main?.aqi || 1;
  const info = getAqiInfo(aqiVal);
  const components = aqiItem.components || {};

  const pollutants = [
    { label: 'PM 2.5', value: components.pm2_5, max: 75, unit: 'µg/m³' },
    { label: 'PM 10', value: components.pm10, max: 150, unit: 'µg/m³' },
    { label: 'NO₂', value: components.no2, max: 200, unit: 'µg/m³' },
    { label: 'O₃', value: components.o3, max: 180, unit: 'µg/m³' },
  ];

  const markerPercent = Math.min(100, Math.max(0, ((aqiVal - 0.5) / 4.5) * 100));

  return (
    <div
      className="surface-card animate-slideUp"
      style={{
        padding: '1.75rem',
        marginBottom: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <Wind size={22} style={{ color: info.color }} />
          <h3>Air Quality Index (AQI)</h3>
        </div>

        <div
          style={{
            background: info.bg,
            color: info.color,
            border: `1px solid ${info.color}40`,
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontWeight: '800',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 4px 14px ${info.bg}`,
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: info.color,
              display: 'inline-block',
              boxShadow: `0 0 10px ${info.color}`,
            }}
          />
          AQI Level {aqiVal} • {info.label}
        </div>
      </div>

      {/* Multi-Color Gradient AQI Scale Meter Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '700' }}>
          <span style={{ color: '#22C55E' }}>Good (1)</span>
          <span style={{ color: '#84CC16' }}>Fair (2)</span>
          <span style={{ color: '#F59E0B' }}>Moderate (3)</span>
          <span style={{ color: '#F97316' }}>Poor (4)</span>
          <span style={{ color: '#EF4444' }}>Very Poor (5)</span>
        </div>

        <div
          style={{
            position: 'relative',
            height: '10px',
            borderRadius: 'var(--radius-pill)',
            background: 'linear-gradient(90deg, #22C55E 0%, #84CC16 25%, #F59E0B 50%, #F97316 75%, #EF4444 100%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {/* Indicator Pin */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: `${markerPercent}%`,
              transform: 'translateX(-50%)',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: info.color,
              border: '3px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              transition: 'left 600ms ease-in-out',
            }}
          />
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldAlert size={16} style={{ color: info.color, flexShrink: 0 }} />
        {info.description}
      </p>

      {/* Pollutant Breakdown Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {pollutants.map((p) => {
          const val = p.value != null ? p.value : 0;
          const ratio = Math.min(100, (val / p.max) * 100);
          return (
            <div
              key={p.label}
              className="metric-card"
              style={{ padding: '0.9rem 1rem', textAlign: 'left' }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '700',
                  marginBottom: '6px',
                }}
              >
                {p.label}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: 1.1 }}>
                {p.value ? p.value.toFixed(1) : '--'}
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginLeft: '4px' }}>
                  {p.unit}
                </span>
              </div>
              {/* Mini fill bar */}
              <div
                style={{
                  height: '4px',
                  width: '100%',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  marginTop: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${ratio}%`,
                    background: info.color,
                    borderRadius: 'var(--radius-pill)',
                    transition: 'width 600ms ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
