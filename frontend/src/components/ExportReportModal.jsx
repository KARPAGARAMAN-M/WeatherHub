import React from 'react';
import { Download, Printer, X, FileText, CheckCircle } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { formatTemp, formatDate, formatTime, formatLocationTitle, formatWind, getAqiInfo } from '../utils/formatters';

export default function ExportReportModal({ isOpen, onClose, currentWeather, forecast, pollution }) {
  const { unit } = useWeatherContext();

  if (!isOpen || !currentWeather) return null;

  const { name, sys, main, weather, dt, timezone, wind, visibility, clouds, state } = currentWeather;
  const locationTitle = formatLocationTitle({ name, state, country: sys?.country });
  const aqiVal = pollution?.list?.[0]?.main?.aqi || 1;
  const aqiInfo = getAqiInfo(aqiVal);

  const handlePrint = () => {
    window.print();
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
      onClick={onClose}
    >
      <div
        className="printable-report"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0F172A',
          border: '1.5px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-dropdown)',
          padding: '2.25rem',
          color: '#FFF',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls (Hidden during print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
              Official Weather Report
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handlePrint}
              style={{ fontSize: '0.85rem', padding: '6px 16px' }}
            >
              <Printer size={16} /> Print / Save as PDF
            </button>

            <button type="button" className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div style={{ border: '2px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', background: 'rgba(255,255,255,0.02)' }}>
          {/* Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-primary)' }}>
                WeatherHub Report
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{locationTitle}</h3>
              <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)' }}>
                {formatDate(dt, timezone)} • {formatTime(dt, timezone)}
              </p>
            </div>
          </div>

          {/* Core Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: '800' }}>
                Current Temperature
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '900', lineHeight: 1.1, margin: '6px 0' }}>
                {formatTemp(main?.temp, unit)}
              </div>
              <div style={{ fontSize: '0.9rem', textTransform: 'capitalize', fontWeight: '700' }}>
                {weather?.[0]?.description} • Feels like {formatTemp(main?.feels_like, unit)}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: '800' }}>
                Air Quality & Atmosphere
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', margin: '6px 0', color: aqiInfo.color }}>
                AQI Level {aqiVal} ({aqiInfo.label})
              </div>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)' }}>
                {aqiInfo.description}
              </div>
            </div>
          </div>

          {/* Key Metrics Breakdown Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', borderRadius: '4px 0 0 4px' }}>Metric</th>
                <th style={{ padding: '8px 12px' }}>Value</th>
                <th style={{ padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>Condition Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '8px 12px', fontWeight: '600' }}>Humidity</td>
                <td style={{ padding: '8px 12px' }}>{main?.humidity}%</td>
                <td style={{ padding: '8px 12px' }}>{main?.humidity > 70 ? 'High' : 'Optimal'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '8px 12px', fontWeight: '600' }}>Wind Speed</td>
                <td style={{ padding: '8px 12px' }}>{formatWind(wind?.speed, unit)}</td>
                <td style={{ padding: '8px 12px' }}>{wind?.speed > 8 ? 'Breezy' : 'Gentle'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '8px 12px', fontWeight: '600' }}>Atmospheric Pressure</td>
                <td style={{ padding: '8px 12px' }}>{main?.pressure} hPa</td>
                <td style={{ padding: '8px 12px' }}>Standard</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', fontWeight: '600' }}>Visibility</td>
                <td style={{ padding: '8px 12px' }}>{visibility ? `${(visibility / 1000).toFixed(1)} km` : '--'}</td>
                <td style={{ padding: '8px 12px' }}>{visibility >= 10000 ? 'Clear' : 'Reduced'}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: 'center', fontSize: '0.78rem', opacity: 0.6, paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            WeatherHub Analytics • Official Certified Weather Summary
          </div>
        </div>
      </div>
    </div>
  );
}
