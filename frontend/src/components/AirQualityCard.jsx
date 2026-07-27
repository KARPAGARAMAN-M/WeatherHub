import React from 'react';
import { Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { getAqiInfo } from '../utils/formatters';

export default function AirQualityCard({ pollutionData }) {
  if (!pollutionData?.list?.[0]) return null;

  const aqiItem = pollutionData.list[0];
  const aqiVal = aqiItem.main?.aqi || 1;
  const info = getAqiInfo(aqiVal);
  const components = aqiItem.components || {};

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} style={{ color: info.color }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Air Quality Index (AQI)</h3>
        </div>

        <div
          style={{
            background: info.bg,
            color: info.color,
            border: `1px solid ${info.color}`,
            borderRadius: '9999px',
            padding: '4px 14px',
            fontWeight: '700',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={14} /> Level {aqiVal}: {info.label}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '1.2rem' }}>
        {info.description}
      </p>

      {/* Pollutants Breakdown Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div className="glass-card-sm" style={{ padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>PM 2.5</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
            {components.pm2_5 ? `${components.pm2_5.toFixed(1)}` : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>µg/m³</div>
        </div>

        <div className="glass-card-sm" style={{ padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>PM 10</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
            {components.pm10 ? `${components.pm10.toFixed(1)}` : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>µg/m³</div>
        </div>

        <div className="glass-card-sm" style={{ padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>NO₂</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
            {components.no2 ? `${components.no2.toFixed(1)}` : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>µg/m³</div>
        </div>

        <div className="glass-card-sm" style={{ padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>O₃ (Ozone)</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
            {components.o3 ? `${components.o3.toFixed(1)}` : '--'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>µg/m³</div>
        </div>
      </div>
    </div>
  );
}
