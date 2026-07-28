import React from 'react';
import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Sun, Cloud } from 'lucide-react';
import { formatWind, getWindDirection, formatTime } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';

export default function WeatherMetrics({ currentWeather }) {
  const { unit } = useWeatherContext();

  if (!currentWeather) return null;

  const { main, wind, sys, visibility, clouds, timezone, uvi } = currentWeather;

  const calcUvi = uvi !== undefined ? uvi : Math.max(0, Math.round((100 - (clouds?.all || 0)) / 12));
  const getUvLevel = (val) => {
    if (val <= 2) return 'Low';
    if (val <= 5) return 'Moderate';
    if (val <= 7) return 'High';
    if (val <= 10) return 'Very High';
    return 'Extreme';
  };

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${main?.humidity ?? '--'}%`,
      icon: Droplets,
      subtext: main?.humidity > 70 ? 'High Humidity' : main?.humidity < 30 ? 'Dry Air' : 'Comfortable',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWind(wind?.speed, unit),
      icon: Wind,
      subtext: `${getWindDirection(wind?.deg)} (${wind?.deg ?? 0}°)`,
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${main?.pressure ?? '--'} hPa`,
      icon: Gauge,
      subtext: main?.pressure > 1013 ? 'High Pressure' : 'Low Pressure',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: visibility ? `${(visibility / 1000).toFixed(1)} km` : '--',
      icon: Eye,
      subtext: visibility >= 10000 ? 'Optimal Clarity' : 'Reduced',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: `${calcUvi}`,
      icon: Sun,
      subtext: getUvLevel(calcUvi),
    },
    {
      id: 'clouds',
      label: 'Cloud Cover',
      value: `${clouds?.all ?? 0}%`,
      icon: Cloud,
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
                  color: 'var(--color-text-secondary)',
                  marginTop: '6px',
                  fontWeight: '500',
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
