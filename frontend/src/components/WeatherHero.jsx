import React from 'react';
import { Star, MapPin, ArrowUp, ArrowDown, Thermometer, Calendar, Clock } from 'lucide-react';
import { formatTemp, formatDate, formatTime, formatTimeIST, formatLocationTitle, getTimezoneLabel } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';
import { useThemeContext } from '../context/ThemeContext';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

export default function WeatherHero({ currentWeather }) {
  const { activeCity, unit, isCitySaved, toggleSaveCity } = useWeatherContext();
  const { theme } = useThemeContext();

  if (!currentWeather) return null;

  const { name, sys, main, weather, dt, timezone, coord, state } = currentWeather;
  const condition = weather?.[0] || {};
  
  const resolvedState = state || activeCity?.state || '';
  const resolvedCountry = sys?.country || activeCity?.country || '';

  const cityObj = {
    name,
    state: resolvedState,
    country: resolvedCountry,
    lat: coord?.lat,
    lon: coord?.lon,
  };

  const isSaved = isCitySaved(cityObj);
  const locationTitle = formatLocationTitle({ name, state: resolvedState, country: resolvedCountry });

  return (
    <div
      className="surface-card animate-slideUp"
      style={{
        padding: '2.25rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '1.75rem',
      }}
    >
      {/* Background Subtle Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          background: 'var(--color-primary-glow)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Main Temperature & Location */}
        <div style={{ flex: '1 1 300px' }}>
          {/* Header Row: City Name & Save Star Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
                {locationTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => toggleSaveCity(cityObj)}
              className="btn-ghost"
              style={{
                padding: '4px 12px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-pill)',
                borderColor: isSaved ? 'var(--color-primary)' : 'var(--card-border)',
                color: isSaved ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isSaved ? 'var(--badge-bg)' : 'transparent',
              }}
              title={isSaved ? 'Remove from saved places' : 'Save city'}
            >
              <Star size={14} fill={isSaved ? 'var(--color-primary)' : 'none'} />
              <span>{isSaved ? 'Saved Location' : 'Save Location'}</span>
            </button>
          </div>

          {/* Date & Dual Time Display (Location Local Time + IST) */}
          <div
            style={{
              fontSize: '0.88rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
              <span>{formatDate(dt, timezone)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} style={{ color: 'var(--color-primary)' }} />
              <span>
                City Local ({getTimezoneLabel(timezone, resolvedCountry)}):{' '}
                <strong style={{ color: 'var(--color-text)' }}>{formatTime(dt, timezone)}</strong>
              </span>
            </div>

            {resolvedCountry !== 'IN' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} style={{ opacity: 0.7 }} />
                <span>
                  IST: <strong style={{ color: 'var(--color-text)' }}>{formatTimeIST(dt)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Giant Temperature Display */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div
              style={{
                fontSize: '5.2rem',
                fontWeight: '900',
                lineHeight: 1,
                letterSpacing: '-0.05em',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {formatTemp(main?.temp, unit)}
            </div>

            <div>
              {/* Condition Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--badge-bg)',
                  color: 'var(--badge-text)',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  marginBottom: '6px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                }}
              >
                {theme?.emoji || '🌤️'} {condition.description || condition.main || 'Clear'}
              </div>

              {/* Feels Like */}
              <div
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '2px',
                }}
              >
                <Thermometer size={14} style={{ color: 'var(--color-primary)' }} />
                Feels like <strong style={{ color: '#FFF' }}>{formatTemp(main?.feels_like, unit)}</strong>
              </div>
            </div>
          </div>

          {/* High / Low Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--card-border)',
              maxWidth: '360px',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.88rem',
                fontWeight: '600',
                color: 'var(--color-text-secondary)',
              }}
            >
              <ArrowUp size={15} style={{ color: '#F87171' }} />
              High: {formatTemp(main?.temp_max, unit)}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.88rem',
                fontWeight: '600',
                color: 'var(--color-text-secondary)',
              }}
            >
              <ArrowDown size={15} style={{ color: 'var(--color-primary)' }} />
              Low: {formatTemp(main?.temp_min, unit)}
            </span>
          </div>
        </div>

        {/* Animated Vector Icon */}
        <div
          className="animate-float"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
          }}
        >
          <AnimatedWeatherIcon size={140} />
        </div>
      </div>
    </div>
  );
}
