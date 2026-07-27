import React from 'react';
import { Star, MapPin, ArrowUp, ArrowDown, Thermometer, Calendar } from 'lucide-react';
import { formatTemp, formatTime, formatDayName } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';

export default function WeatherHero({ currentWeather }) {
  const { unit, isCitySaved, toggleSaveCity } = useWeatherContext();

  if (!currentWeather) return null;

  const { name, sys, main, weather, dt, timezone, coord } = currentWeather;
  const condition = weather?.[0] || {};
  const isSaved = isCitySaved(name);

  const cityObj = {
    name,
    country: sys?.country || '',
    lat: coord?.lat,
    lon: coord?.lon,
  };

  const iconUrl = condition.icon
    ? `https://openweathermap.org/img/wn/${condition.icon}@4x.png`
    : null;

  return (
    <div className="glass-panel animate-float" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background Ambient Light */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'var(--color-primary)',
          opacity: 0.15,
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.1 }}>
              {name}{sys?.country ? `, ${sys.country}` : ''}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> {formatDayName(dt, timezone)}
            </span>
            <span>•</span>
            <span>{formatTime(dt, timezone)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleSaveCity(cityObj)}
          className="btn-glass"
          style={{
            borderColor: isSaved ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
            color: isSaved ? 'var(--color-primary)' : '#fff',
            padding: '8px 14px',
          }}
          title={isSaved ? 'Remove from saved places' : 'Save city to dashboard'}
        >
          <Star size={18} fill={isSaved ? 'var(--color-primary)' : 'none'} />
          <span className="hide-mobile">{isSaved ? 'Saved' : 'Save City'}</span>
        </button>
      </div>

      {/* Main Temperature & Visuals Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '1rem',
        }}
      >
        {/* Main Temperature Display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <div style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.04em' }}>
            {formatTemp(main?.temp, unit)}
          </div>

          <div>
            <div style={{ textTransform: 'capitalize', fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-primary)' }}>
              {condition.description || condition.main || 'Clear'}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Thermometer size={14} /> Feels like {formatTemp(main?.feels_like, unit)}
            </div>
          </div>
        </div>

        {/* Condition Icon & High/Low Range */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem' }}>
          {iconUrl && (
            <img
              src={iconUrl}
              alt={condition.description}
              style={{
                width: '110px',
                height: '110px',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                objectFit: 'contain',
              }}
            />
          )}

          <div
            className="glass-card-sm"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '110px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6b6b', fontWeight: '600', fontSize: '0.9rem' }}>
              <ArrowUp size={16} /> Max: {formatTemp(main?.temp_max, unit)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4dabf7', fontWeight: '600', fontSize: '0.9rem' }}>
              <ArrowDown size={16} /> Min: {formatTemp(main?.temp_min, unit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
