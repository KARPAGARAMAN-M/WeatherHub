import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Thermometer, Wind, Droplets, Gauge, Eye, Sun, CloudRain } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { formatTemp, formatWind, getAqiInfo } from '../utils/formatters';
import { fetchApi } from '../utils/api';

const POPULAR_COMPARISON_CITIES = [
  { name: 'Chennai', country: 'IN', lat: 13.0827, lon: 80.2707 },
  { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
];

export default function CityComparisonModal({ isOpen, onClose, currentWeather }) {
  const { activeCity, unit, apiKey } = useWeatherContext();
  const [city2, setCity2] = useState(POPULAR_COMPARISON_CITIES[2]); // London fallback
  const [weather2, setWeather2] = useState(null);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    if (!isOpen || !city2) return;
    setLoading2(true);

    const params = {};
    if (city2.lat && city2.lon) {
      params.lat = city2.lat;
      params.lon = city2.lon;
    } else {
      params.city = city2.name;
    }
    if (apiKey) params.apiKey = apiKey;

    fetchApi('/api/weather/current', params)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setWeather2(data))
      .catch((err) => console.error('Comparison fetch error:', err))
      .finally(() => setLoading2(false));
  }, [isOpen, city2, apiKey]);

  if (!isOpen) return null;

  const w1 = currentWeather;
  const w2 = weather2;

  const metricsComparison = [
    { label: 'Temperature', val1: formatTemp(w1?.main?.temp, unit), val2: formatTemp(w2?.main?.temp, unit), icon: Thermometer },
    { label: 'Feels Like', val1: formatTemp(w1?.main?.feels_like, unit), val2: formatTemp(w2?.main?.feels_like, unit), icon: Thermometer },
    { label: 'Humidity', val1: w1?.main?.humidity != null ? `${w1.main.humidity}%` : '--', val2: w2?.main?.humidity != null ? `${w2.main.humidity}%` : '--', icon: Droplets },
    { label: 'Wind Speed', val1: formatWind(w1?.wind?.speed, unit), val2: formatWind(w2?.wind?.speed, unit), icon: Wind },
    { label: 'Pressure', val1: w1?.main?.pressure != null ? `${w1.main.pressure} hPa` : '--', val2: w2?.main?.pressure != null ? `${w2.main.pressure} hPa` : '--', icon: Gauge },
    { label: 'Cloud Cover', val1: w1?.clouds?.all != null ? `${w1.clouds.all}%` : '--', val2: w2?.clouds?.all != null ? `${w2.clouds.all}%` : '--', icon: CloudRain },
    { label: 'Visibility', val1: w1?.visibility ? `${(w1.visibility / 1000).toFixed(1)} km` : '--', val2: w2?.visibility ? `${(w2.visibility / 1000).toFixed(1)} km` : '--', icon: Eye },
  ];

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
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-dropdown)',
          padding: '2rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--badge-bg)', color: 'var(--color-primary)' }}>
              <ArrowRightLeft size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#FFF' }}>
                City Weather Comparison
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                Compare current weather metrics side-by-side
              </p>
            </div>
          </div>

          <button type="button" className="btn-icon" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* City Selectors Header Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* City 1 (Active) */}
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(56, 189, 248, 0.15)', border: '1.5px solid #38BDF8' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#38BDF8', textTransform: 'uppercase' }}>Current City</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF', marginTop: '4px' }}>
              {activeCity?.name || 'Chennai'}
            </h4>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#38BDF8', marginTop: '8px' }}>
              {formatTemp(w1?.main?.temp, unit)}
            </div>
          </div>

          {/* City 2 (Selector) */}
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(251, 191, 36, 0.15)', border: '1.5px solid #FBBF24' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#FBBF24', textTransform: 'uppercase' }}>Comparing With</span>
              <select
                value={city2?.name}
                onChange={(e) => {
                  const match = POPULAR_COMPARISON_CITIES.find(c => c.name === e.target.value);
                  if (match) setCity2(match);
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: '#FFF',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '3px 8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  outline: 'none',
                }}
              >
                {POPULAR_COMPARISON_CITIES.map((c) => (
                  <option key={c.name} value={c.name} style={{ background: '#0F172A', color: '#FFF' }}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
            </div>

            <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF', marginTop: '4px' }}>
              {city2?.name}
            </h4>

            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FBBF24', marginTop: '8px' }}>
              {loading2 ? 'Loading...' : formatTemp(w2?.main?.temp, unit)}
            </div>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {metricsComparison.map((m) => {
            const IconComp = m.icon;
            return (
              <div
                key={m.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px 1fr',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--card-border)',
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38BDF8' }}>
                  {m.val1}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
                  <IconComp size={15} style={{ color: 'var(--color-primary)' }} />
                  {m.label}
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FBBF24', textAlign: 'right' }}>
                  {m.val2}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
