import React from 'react';
import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Sun, Cloud } from 'lucide-react';
import { formatWind, getWindDirection, formatTime } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';

function CircularGauge({ percent, color = 'var(--color-primary)', size = 38 }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const validPercent = Math.max(0, Math.min(100, percent || 0));
  const strokeDashoffset = circumference - (validPercent / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="3.5"
      />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 800ms ease, stroke 400ms ease' }}
      />
    </svg>
  );
}

export default function WeatherMetrics({ currentWeather }) {
  const { unit } = useWeatherContext();

  if (!currentWeather) return null;

  const { main, wind, sys, visibility, clouds, timezone, uvi } = currentWeather;

  const calcUvi = uvi !== undefined ? uvi : Math.max(0, Math.round((100 - (clouds?.all || 0)) / 12));
  
  const getUvInfo = (val) => {
    if (val <= 2) return { label: 'Low', color: '#22C55E' };
    if (val <= 5) return { label: 'Moderate', color: '#FBBF24' };
    if (val <= 7) return { label: 'High', color: '#F97316' };
    if (val <= 10) return { label: 'Very High', color: '#EF4444' };
    return { label: 'Extreme', color: '#A855F7' };
  };

  const getHumidityColor = (val) => {
    if (val >= 30 && val <= 60) return '#22C55E';
    if (val > 60 && val <= 80) return '#38BDF8';
    if (val > 80) return '#A855F7';
    return '#F59E0B'; // Dry
  };

  const getWindColor = (spd) => {
    if (spd < 4) return '#22C55E';
    if (spd < 8) return '#38BDF8';
    if (spd < 14) return '#F59E0B';
    return '#EF4444';
  };

  const getVisColor = (vis) => {
    if (vis >= 10000) return '#22C55E';
    if (vis >= 5000) return '#FBBF24';
    return '#F97316';
  };

  const uvInfo = getUvInfo(calcUvi);
  const humidityPercent = main?.humidity ?? 0;
  const uvPercent = (calcUvi / 12) * 100;
  const windPercent = Math.min(100, ((wind?.speed || 0) / 20) * 100);
  const pressurePercent = Math.min(100, Math.max(0, (((main?.pressure || 1013) - 970) / 70) * 100));
  const visPercent = Math.min(100, (((visibility || 10000) / 10000) * 100));
  const cloudPercent = clouds?.all ?? 0;

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${main?.humidity ?? '--'}%`,
      icon: Droplets,
      gaugePercent: humidityPercent,
      color: getHumidityColor(main?.humidity),
      subtext: main?.humidity > 70 ? 'High Humidity' : main?.humidity < 30 ? 'Dry Air' : 'Comfortable',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWind(wind?.speed, unit),
      icon: Wind,
      gaugePercent: windPercent,
      color: getWindColor(wind?.speed || 0),
      subtext: `${getWindDirection(wind?.deg)} (${wind?.deg ?? 0}°)`,
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${main?.pressure ?? '--'} hPa`,
      icon: Gauge,
      gaugePercent: pressurePercent,
      color: main?.pressure > 1013 ? '#38BDF8' : '#F59E0B',
      subtext: main?.pressure > 1013 ? 'High Pressure' : 'Low Pressure',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: visibility ? `${(visibility / 1000).toFixed(1)} km` : '--',
      icon: Eye,
      gaugePercent: visPercent,
      color: getVisColor(visibility || 10000),
      subtext: visibility >= 10000 ? 'Optimal Clarity' : 'Reduced',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: `${calcUvi}`,
      icon: Sun,
      gaugePercent: uvPercent,
      color: uvInfo.color,
      subtext: uvInfo.label,
    },
    {
      id: 'clouds',
      label: 'Cloud Cover',
      value: `${clouds?.all ?? 0}%`,
      icon: Cloud,
      gaugePercent: cloudPercent,
      color: '#94A3B8',
      subtext: clouds?.all > 50 ? 'Heavy Overcast' : clouds?.all > 20 ? 'Partly Cloudy' : 'Clear Sky',
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
      value: formatTime(sys?.sunrise, timezone),
      icon: Sunrise,
      subtext: 'Morning Dawn',
    },
    {
      id: 'sunset',
      label: 'Sunset',
      value: formatTime(sys?.sunset, timezone),
      icon: Sunset,
      subtext: 'Evening Dusk',
    },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-heading">
        <Droplets size={20} />
        <h3>Weather Details & Metrics</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {metrics.map((m, idx) => {
          const IconComponent = m.icon;
          return (
            <div
              key={m.id}
              className={`metric-card animate-slideUp delay-${Math.min(idx + 1, 4)}`}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.85rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {m.label}
                </span>

                {m.gaugePercent !== undefined ? (
                  <CircularGauge percent={m.gaugePercent} color={m.color} size={34} />
                ) : (
                  <div
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--badge-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={16} style={{ color: 'var(--color-primary)' }} />
                  </div>
                )}
              </div>

              <div
                style={{
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {m.value}
              </div>

              <div
                style={{
                  fontSize: '0.78rem',
                  color: m.color || 'var(--color-text-secondary)',
                  marginTop: '6px',
                  fontWeight: '600',
                }}
              >
                {m.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
