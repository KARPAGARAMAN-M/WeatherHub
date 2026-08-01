import React from 'react';
import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Sun, Cloud, Moon, Thermometer, Compass, Activity, CloudRain, Snowflake } from 'lucide-react';
import {
  formatWind,
  getWindDirection,
  formatTime,
  formatTemp,
  getAqiInfo,
  calculateRainIntensity,
  calculateSnowIntensity,
  formatCoordinates
} from '../utils/formatters';
import { calculateDewPoint, calculateMoonPhase } from '../utils/lifestyleCalc';
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

export default function WeatherMetrics({ currentWeather, pollutionData }) {
  const { unit } = useWeatherContext();

  if (!currentWeather) return null;

  const { main, wind, sys, visibility, clouds, timezone, uvi, rain, snow, coord, elevation } = currentWeather;

  const calcUvi = uvi !== undefined ? uvi : Math.max(0, Math.round((100 - (clouds?.all || 0)) / 12));

  // Precision Calculations
  const tempC = main?.temp || 25;
  const humVal = main?.humidity || 60;
  const dewPointC = calculateDewPoint(tempC, humVal);
  const moonInfo = calculateMoonPhase();
  const aqiVal = pollutionData?.list?.[0]?.main?.aqi || 1;
  const aqiInfo = getAqiInfo(aqiVal);
  const rainInfo = calculateRainIntensity(rain, currentWeather?.weather?.[0]?.description);
  const snowInfo = calculateSnowIntensity(snow, currentWeather?.weather?.[0]?.description);
  
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
    return '#F59E0B';
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
  const humidityPercent = humVal;
  const uvPercent = (calcUvi / 12) * 100;
  const windPercent = Math.min(100, ((wind?.speed || 0) / 20) * 100);
  const pressurePercent = Math.min(100, Math.max(0, (((main?.pressure || 1013) - 970) / 70) * 100));
  const visPercent = Math.min(100, (((visibility || 10000) / 10000) * 100));
  const cloudPercent = clouds?.all ?? 0;

  const metrics = [
    {
      id: 'feels_like',
      label: 'Feels Like',
      value: formatTemp(main?.feels_like, unit),
      icon: Thermometer,
      gaugePercent: Math.min(100, Math.max(0, ((main?.feels_like || 20) / 45) * 100)),
      color: 'var(--color-primary)',
      subtext: main?.feels_like > main?.temp ? 'Warmer than actual' : 'Cooler than actual',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${humVal}%`,
      icon: Droplets,
      gaugePercent: humidityPercent,
      color: getHumidityColor(humVal),
      subtext: humVal > 70 ? 'High Moisture' : humVal < 30 ? 'Dry Air' : 'Comfortable Zone',
    },
    {
      id: 'dew_point',
      label: 'Dew Point',
      value: formatTemp(dewPointC, unit),
      icon: Droplets,
      gaugePercent: Math.min(100, Math.max(0, ((dewPointC + 5) / 35) * 100)),
      color: '#38BDF8',
      subtext: dewPointC > 20 ? 'Muggy Air' : 'Comfortable',
    },
    {
      id: 'rain_rate',
      label: 'Rainfall Intensity',
      value: rainInfo.formatted,
      icon: CloudRain,
      gaugePercent: Math.min(100, (rainInfo.mmPerHour / 20) * 100),
      color: rainInfo.badgeColor,
      subtext: rainInfo.label,
    },
    {
      id: 'wind',
      label: 'Wind & Gusts',
      value: formatWind(wind?.speed, unit, wind?.gust),
      icon: Wind,
      gaugePercent: windPercent,
      color: getWindColor(wind?.speed || 0),
      subtext: `${getWindDirection(wind?.deg)} (${wind?.deg ?? 0}°)`,
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
      id: 'aqi',
      label: 'Air Quality (AQI)',
      value: `AQI ${aqiVal}`,
      icon: Activity,
      gaugePercent: (aqiVal / 5) * 100,
      color: aqiInfo.color,
      subtext: aqiInfo.label,
    },
    {
      id: 'pressure',
      label: 'Atmospheric Pressure',
      value: `${main?.pressure ?? '--'} hPa`,
      icon: Gauge,
      gaugePercent: pressurePercent,
      color: main?.pressure > 1013 ? '#38BDF8' : '#F59E0B',
      subtext: main?.pressure > 1013 ? 'High Pressure' : 'Low Pressure System',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: visibility ? `${(visibility / 1000).toFixed(1)} km` : '--',
      icon: Eye,
      gaugePercent: visPercent,
      color: getVisColor(visibility || 10000),
      subtext: visibility >= 10000 ? 'Optimal Clarity' : 'Reduced Clarity',
    },
    {
      id: 'clouds',
      label: 'Cloud Coverage',
      value: `${clouds?.all ?? 0}%`,
      icon: Cloud,
      gaugePercent: cloudPercent,
      color: '#94A3B8',
      subtext: clouds?.all > 70 ? 'Overcast Sky' : clouds?.all > 20 ? 'Scattered Clouds' : 'Clear Sky',
    },
    {
      id: 'coords',
      label: 'Coordinates & Elevation',
      value: `${coord?.lat ? coord.lat.toFixed(2) : '--'}°, ${coord?.lon ? coord.lon.toFixed(2) : '--'}°`,
      icon: Compass,
      color: 'var(--color-primary)',
      subtext: elevation != null ? `Elevation: ${elevation}m` : 'GPS Position',
    },
    {
      id: 'moon',
      label: 'Moon Phase',
      value: moonInfo.iconEmoji,
      icon: Moon,
      color: '#A855F7',
      subtext: moonInfo.phaseName,
    },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-heading">
        <Droplets size={20} />
        <h3>Meteorological Parameters & Environmental Precision</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
                  fontSize: '1.35rem',
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
