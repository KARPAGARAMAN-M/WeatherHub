import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

/**
 * Dynamic Weather Illustration Scene Component
 * Displays a multi-layered animated vector weather scene that eliminates
 * the large empty space on the right side of the main weather card.
 */
export default function WeatherIllustration({ themeKey, conditionText }) {
  const { theme } = useThemeContext();
  const activeKey = themeKey || theme?.key || 'Clear';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '320px',
        height: '210px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(0, 0, 0, 0.22)',
        border: '1.5px solid var(--card-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'hidden',
        transition: 'border-color 500ms ease, box-shadow 500ms ease',
      }}
    >
      {/* Background Ambient Radial Light Circle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme?.ambientColor || 'rgba(255, 255, 255, 0.2)'} 0%, transparent 70%)`,
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Animated Central Icon Scene */}
      <div
        className="animate-float"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
        }}
      >
        <AnimatedWeatherIcon themeKey={activeKey} size={130} />
      </div>

      {/* Weather Scene Sub-label Badge */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          fontSize: '0.82rem',
          fontWeight: '700',
          color: 'var(--badge-text)',
          background: 'var(--badge-bg)',
          border: '1px solid var(--card-border)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-pill)',
          backdropFilter: 'blur(8px)',
          textTransform: 'capitalize',
          letterSpacing: '0.02em',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {theme?.emoji || '🌤️'} {conditionText || theme?.name || 'Live Weather'}
      </div>
    </div>
  );
}
