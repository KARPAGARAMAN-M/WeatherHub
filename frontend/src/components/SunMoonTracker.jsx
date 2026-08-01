import React from 'react';
import { Sun, Moon, Sunrise, Sunset, Compass, Camera, Sparkles } from 'lucide-react';
import { calculateMoonPhase } from '../utils/lifestyleCalc';
import { formatTime, calculatePhotographyHours } from '../utils/formatters';

export default function SunMoonTracker({ currentWeather }) {
  if (!currentWeather) return null;

  const { sys, timezone, dt } = currentWeather;
  const moonInfo = calculateMoonPhase();
  const photoHours = calculatePhotographyHours(sys?.sunrise, sys?.sunset, timezone);

  const sunrise = sys?.sunrise || Math.floor(Date.now() / 1000) - 21600;
  const sunset = sys?.sunset || Math.floor(Date.now() / 1000) + 21600;
  const nowSec = dt || Math.floor(Date.now() / 1000);

  // Calculate Sun position progress ratio (0 to 1) between sunrise and sunset
  const totalDaySec = Math.max(1, sunset - sunrise);
  const elapsedSec = Math.max(0, Math.min(totalDaySec, nowSec - sunrise));
  const sunProgressRatio = elapsedSec / totalDaySec;
  const isDaytime = nowSec >= sunrise && nowSec <= sunset;

  // Arc path calculation (SVG semicircle arc from left to right)
  const angleRad = Math.PI * (1 - sunProgressRatio);
  const sunX = 140 + 110 * Math.cos(angleRad);
  const sunY = 130 - 110 * Math.sin(angleRad);

  return (
    <div
      className="surface-card animate-slideUp"
      style={{
        padding: '1.75rem',
        marginBottom: '2rem',
      }}
    >
      <div className="section-heading" style={{ marginBottom: '1.25rem' }}>
        <Compass size={22} style={{ color: 'var(--color-primary)' }} />
        <h3>Celestial Tracker & Photography Hours</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Sun Trajectory Card */}
        <div className="metric-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Solar Trajectory
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
              {isDaytime ? 'Daylight Hours' : 'Nighttime'}
            </span>
          </div>

          {/* SVG Sun Elevation Semicircle Arc */}
          <div style={{ position: 'relative', width: '280px', height: '140px', margin: '0 auto' }}>
            <svg width="280" height="140" viewBox="0 0 280 140" style={{ overflow: 'visible' }}>
              <line x1="20" y1="130" x2="260" y2="130" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeDasharray="4 4" />
              <path
                d="M 30 130 A 110 110 0 0 1 250 130"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              {isDaytime && (
                <path
                  d={`M 30 130 A 110 110 0 0 1 ${sunX} ${sunY}`}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 8px var(--color-primary-glow))' }}
                />
              )}
              {isDaytime && (
                <g transform={`translate(${sunX}, ${sunY})`}>
                  <circle r="12" fill="var(--color-primary)" style={{ filter: 'drop-shadow(0 0 12px #FBBF24)' }} />
                  <circle r="6" fill="#FFF" />
                </g>
              )}
            </svg>
          </div>

          {/* Sunrise / Sunset Times */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sunrise size={18} style={{ color: '#FBBF24' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Sunrise</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFF' }}>{formatTime(sunrise, timezone)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sunset size={18} style={{ color: '#F97316' }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Sunset</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFF' }}>{formatTime(sunset, timezone)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Golden Hour & Blue Hour Photography Window */}
        <div className="metric-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Camera size={14} /> Golden & Blue Hours
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FBBF24', padding: '2px 8px', background: 'rgba(251, 191, 36, 0.2)', borderRadius: 'var(--radius-pill)' }}>
              {photoHours.currentPhotoPhase}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* Morning Golden Hour */}
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: '#F59E0B' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFF' }}>Morning Golden Hour</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#FBBF24' }}>{photoHours.morningGoldenHour}</span>
            </div>

            {/* Evening Golden Hour */}
            <div style={{ background: 'rgba(249, 115, 22, 0.12)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: '#F97316' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFF' }}>Evening Golden Hour</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#F97316' }}>{photoHours.eveningGoldenHour}</span>
            </div>

            {/* Blue Hour Window */}
            <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={16} style={{ color: '#38BDF8' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFF' }}>Evening Blue Hour</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#38BDF8' }}>{photoHours.eveningBlueHour}</span>
            </div>
          </div>

          <div
            style={{
              paddingTop: '0.75rem',
              marginTop: '0.75rem',
              borderTop: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>Optimal Outdoor Lighting</span>
            <strong style={{ color: '#FFF' }}>Soft Warm Tones</strong>
          </div>
        </div>

        {/* Moon Phase Card */}
        <div className="metric-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#A855F7', textTransform: 'uppercase' }}>
              Lunar Cycle
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
              Age: {moonInfo.moonAgeDays} days
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '0.5rem 0' }}>
            <div
              style={{
                fontSize: '3.5rem',
                lineHeight: 1,
                filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.4))',
              }}
            >
              {moonInfo.iconEmoji}
            </div>

            <div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFF' }}>
                {moonInfo.phaseName}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#A855F7', fontWeight: '700', marginTop: '2px' }}>
                {moonInfo.illumination}% Illumination
              </p>
            </div>
          </div>

          <div
            style={{
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>Moon Visibility</span>
            <strong style={{ color: '#FFF' }}>
              {moonInfo.illumination > 50 ? 'Bright Night Sky' : 'Dark Night Sky'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
