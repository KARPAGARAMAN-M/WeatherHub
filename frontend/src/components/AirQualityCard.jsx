import React from 'react';
import { Wind } from 'lucide-react';
import { getAqiInfo } from '../utils/formatters';

export default function AirQualityCard({ pollutionData }) {
  if (!pollutionData?.list?.[0]) return null;

  const aqiItem = pollutionData.list[0];
  const aqiVal = aqiItem.main?.aqi || 1;
  const info = getAqiInfo(aqiVal);
  const components = aqiItem.components || {};

  const pollutants = [
    { label: 'PM 2.5', value: components.pm2_5, unit: 'µg/m³' },
    { label: 'PM 10', value: components.pm10, unit: 'µg/m³' },
    { label: 'NO₂', value: components.no2, unit: 'µg/m³' },
    { label: 'O₃', value: components.o3, unit: 'µg/m³' },
  ];

  return (
    <div
      className="surface-card animate-slideUp"
      style={{
        padding: '1.75rem',
        marginBottom: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <Wind size={20} />
          <h3>Air Quality Index</h3>
        </div>

        <div
          style={{
            background: info.bg,
            color: info.color,
            borderRadius: 'var(--radius-pill)',
            padding: '5px 14px',
            fontWeight: '700',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: info.color,
              display: 'inline-block',
              boxShadow: `0 0 8px ${info.color}`,
            }}
          />
          AQI {aqiVal} • {info.label}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.2rem', lineHeight: '1.4' }}>
        {info.description}
      </p>

      {/* Pollutant Breakdown Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {pollutants.map((p) => (
          <div
            key={p.label}
            className="metric-card"
            style={{ padding: '0.85rem', textAlign: 'center' }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '700',
                marginBottom: '4px',
              }}
            >
              {p.label}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: 1.2 }}>
              {p.value ? p.value.toFixed(1) : '--'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{p.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
