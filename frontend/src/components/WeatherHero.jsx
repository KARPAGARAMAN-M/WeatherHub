import React, { useState, useEffect } from 'react';
import { Star, MapPin, ArrowUp, ArrowDown, Thermometer, Calendar, Clock, Navigation } from 'lucide-react';
import { formatTemp, formatDate, formatTime, formatTimeIST, formatLocationTitle, getTimezoneLabel, convertTemp } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';
import { useThemeContext } from '../context/ThemeContext';
import WeatherIllustration from './WeatherIllustration';

export default function WeatherHero({ currentWeather }) {
  const { activeCity, unit, isCitySaved, toggleSaveCity } = useWeatherContext();
  const { theme } = useThemeContext();

  const [displayTemp, setDisplayTemp] = useState(null);

  const targetTemp = currentWeather?.main?.temp;

  // Smooth number transition animation on temperature change
  useEffect(() => {
    if (targetTemp == null) return;
    if (displayTemp == null) {
      setDisplayTemp(targetTemp);
      return;
    }

    const startTemp = displayTemp;
    const diff = targetTemp - startTemp;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentVal = startTemp + diff * easeProgress;
      setDisplayTemp(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetTemp, unit]);

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

  const tempVal = displayTemp != null ? displayTemp : main?.temp;

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
          width: '260px',
          height: '260px',
          background: 'var(--color-primary-glow)',
          borderRadius: '50%',
          filter: 'blur(60px)',
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
        <div style={{ flex: '1 1 340px' }}>
          {/* Header Row: City Name & Save Star Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={22} style={{ color: 'var(--color-primary)' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
                {locationTitle}
              </h2>
            </div>
            {activeCity?.isCurrentLocation && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Navigation size={12} /> Live Location
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleSaveCity(cityObj)}
              className="btn-ghost"
              style={{
                padding: '5px 14px',
                fontSize: '0.82rem',
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
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={15} style={{ color: 'var(--color-primary)' }} />
              <span>{formatDate(dt, timezone)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={15} style={{ color: 'var(--color-primary)' }} />
              <span>
                City Local ({getTimezoneLabel(timezone, resolvedCountry)}):{' '}
                <strong style={{ color: 'var(--color-text)' }}>{formatTime(dt, timezone)}</strong>
              </span>
            </div>

            {resolvedCountry !== 'IN' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={15} style={{ opacity: 0.7 }} />
                <span>
                  IST: <strong style={{ color: 'var(--color-text)' }}>{formatTimeIST(dt)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Visual Focal Point: Enlarged Temperature Display */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                fontSize: '4.8rem',
                fontWeight: '900',
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#FFFFFF',
                textShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
                fontFeatureSettings: '"tnum"',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatTemp(tempVal, unit)}
            </div>

            <div>
              {/* Condition Badge */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--badge-bg)',
                  color: 'var(--badge-text)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  marginBottom: '8px',
                  border: '1px solid var(--card-border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {theme?.emoji || '🌤️'} {condition.description || condition.main || 'Clear'}
              </div>

              {/* Feels Like */}
              <div
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Thermometer size={16} style={{ color: 'var(--color-primary)' }} />
                Feels like <strong style={{ color: '#FFF' }}>{formatTemp(main?.feels_like, unit)}</strong>
              </div>
            </div>
          </div>

          {/* High / Low Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '1.5rem',
              paddingTop: '1.1rem',
              borderTop: '1px solid var(--card-border)',
              maxWidth: '380px',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--color-text-secondary)',
              }}
            >
              <ArrowUp size={16} style={{ color: '#F87171' }} />
              High: <strong style={{ color: '#FFF' }}>{formatTemp(main?.temp_max, unit)}</strong>
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--color-text-secondary)',
              }}
            >
              <ArrowDown size={16} style={{ color: 'var(--color-primary)' }} />
              Low: <strong style={{ color: '#FFF' }}>{formatTemp(main?.temp_min, unit)}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Weather Illustration (Eliminating Empty Right Space) */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <WeatherIllustration
            themeKey={theme?.key}
            conditionText={condition.description || condition.main}
          />
        </div>
      </div>
    </div>
  );
}
