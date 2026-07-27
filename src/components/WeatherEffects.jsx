import React, { useMemo } from 'react';
import { useThemeContext } from '../context/ThemeContext';

export default function WeatherEffects() {
  const { theme } = useThemeContext();
  const effect = theme.ambientEffect || 'sunny';

  // Generate rain drop elements
  const rainDrops = useMemo(() => {
    if (effect !== 'rain' && effect !== 'storm') return [];
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${0.5 + Math.random() * 0.6}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
  }, [effect]);

  // Generate snowflake elements
  const snowflakes = useMemo(() => {
    if (effect !== 'snow') return [];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${3 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 3}s`,
      size: `${0.8 + Math.random() * 0.8}rem`,
    }));
  }, [effect]);

  return (
    <div className="weather-effects-container" aria-hidden="true">
      {/* Sunny Ambient Glow */}
      {effect === 'sunny' && (
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: '45vw',
            height: '45vw',
            background: 'radial-gradient(circle, rgba(255,213,79,0.3) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'pulseGlow 6s ease-in-out infinite',
          }}
        />
      )}

      {/* Rain Particle Effects */}
      {(effect === 'rain' || effect === 'storm') &&
        rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="drop"
            style={{
              left: drop.left,
              animationDuration: drop.animationDuration,
              animationDelay: drop.animationDelay,
            }}
          />
        ))}

      {/* Snow Particle Effects */}
      {effect === 'snow' &&
        snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              fontSize: flake.size,
              animationDuration: flake.animationDuration,
              animationDelay: flake.animationDelay,
            }}
          >
            ❄
          </div>
        ))}
    </div>
  );
}
