import React from 'react';
import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Compass } from 'lucide-react';
import { formatWind, getWindDirection, formatTime } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';

export default function WeatherMetrics({ currentWeather }) {
  const { unit } = useWeatherContext();

  if (!currentWeather) return null;

  const { main, wind, sys, visibility, timezone } = currentWeather;

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${main?.humidity ?? '--'}%`,
      icon: Droplets,
      color: '#4A90E2',
      subtext: main?.humidity > 70 ? 'High Humidity' : main?.humidity < 30 ? 'Dry Air' : 'Comfortable',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWind(wind?.speed, unit),
      icon: Wind,
      color: '#4DB6AC',
      subtext: `${getWindDirection(wind?.deg)} (${wind?.deg ?? 0}°)`,
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${main?.pressure ?? '--'} hPa`,
      icon: Gauge,
      color: '#FFD54F',
      subtext: main?.pressure > 1013 ? 'High Pressure System' : 'Low Pressure System',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: visibility ? `${(visibility / 1000).toFixed(1)} km` : '--',
      icon: Eye,
      color: '#A7C7E7',
      subtext: visibility >= 10000 ? 'Clear Vision' : 'Reduced Visibility',
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
      value: formatTime(sys?.sunrise, timezone),
      icon: Sunrise,
      color: '#FFB74D',
      subtext: 'Dawn',
    },
    {
      id: 'sunset',
      label: 'Sunset',
      value: formatTime(sys?.sunset, timezone),
      icon: Sunset,
      color: '#BA68C8',
      subtext: 'Dusk',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem',
      }}
    >
      {metrics.map((m) => {
        const IconComponent = m.icon;
        return (
          <div key={m.id} className="glass-card-sm" style={{ padding: '1.2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)' }}>
                {m.label}
              </span>
              <IconComponent size={20} style={{ color: m.color }} />
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', lineHeight: 1.2 }}>
              {m.value}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '4px' }}>
              {m.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
