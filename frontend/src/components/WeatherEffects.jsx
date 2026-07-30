import React, { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * WeatherEffects Component
 * Dynamic Background Animation & Dual-Layer Gradient Cross-Fade Engine:
 * - 800ms Butter-Smooth Background Cross-Fade between all weather condition transitions
 * - Clear: Sunbeam glow + warm ambient orbs
 * - PartlyCloudy: Floating sky clouds
 * - Clouds: Rolling cloud deck
 * - Rain: Canvas animated falling rain & splash droplets
 * - Thunderstorm: Canvas rain + random lightning flash generator
 * - Snow: Canvas swaying snowflakes
 * - Mist: Drifting fog overlays
 * - Night: Canvas twinkling starfield + moon glow
 */
export default function WeatherEffects() {
  const { theme } = useThemeContext();
  const canvasRef = useRef(null);
  const activeKey = theme?.key || 'Clear';

  // --- Dual Layer Background Cross-Fade Engine ---
  const initialGrad = theme?.bgGradient || 'linear-gradient(135deg, #0284C7 0%, #38BDF8 40%, #F59E0B 80%, #FBBF24 100%)';
  const [bgLayers, setBgLayers] = useState({
    activeLayer: 'A',
    gradA: initialGrad,
    gradB: initialGrad,
  });

  const prevGradientRef = useRef(theme?.bgGradient);

  useEffect(() => {
    if (theme?.bgGradient && theme.bgGradient !== prevGradientRef.current) {
      prevGradientRef.current = theme.bgGradient;
      setBgLayers((prev) => {
        if (prev.activeLayer === 'A') {
          return { activeLayer: 'B', gradA: prev.gradA, gradB: theme.bgGradient };
        } else {
          return { activeLayer: 'A', gradA: theme.bgGradient, gradB: prev.gradB };
        }
      });
    }
  }, [theme?.bgGradient]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const w = canvas.width;
    const h = canvas.height;

    // --- 1. Rain & Thunderstorm Particles ---
    const rainCount = activeKey === 'Thunderstorm' ? 120 : 80;
    const drops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 20 + 12,
      speed: Math.random() * 10 + 12,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    // --- 2. Snow Particles ---
    const snowCount = 65;
    const snowflakes = Array.from({ length: snowCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1.5,
      speed: Math.random() * 1.5 + 0.5,
      sway: Math.random() * 2 - 1,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // --- 3. Night Starfield Particles ---
    const starCount = 90;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random(),
      alphaChange: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // --- Lightning Flash state ---
    let lightningOpacity = 0;
    let nextFlashTimer = Math.floor(Math.random() * 200) + 100;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeKey === 'Rain' || activeKey === 'Thunderstorm') {
        // Draw Rain Streaks
        ctx.strokeStyle = activeKey === 'Thunderstorm' ? '#C084FC' : '#38BDF8';
        ctx.lineWidth = 1.5;
        drops.forEach((d) => {
          ctx.beginPath();
          ctx.globalAlpha = d.opacity;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 3, d.y + d.length);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 0.8;
          if (d.y > canvas.height) {
            d.y = -20;
            d.x = Math.random() * canvas.width;
          }
        });

        // Thunderstorm Lightning Flash
        if (activeKey === 'Thunderstorm') {
          nextFlashTimer--;
          if (nextFlashTimer <= 0) {
            lightningOpacity = Math.random() * 0.85 + 0.15;
            nextFlashTimer = Math.floor(Math.random() * 240) + 120;
          }

          if (lightningOpacity > 0) {
            ctx.fillStyle = `rgba(224, 231, 255, ${lightningOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lightningOpacity *= 0.82; // rapid decay
          }
        }
      } else if (activeKey === 'Snow') {
        // Draw Snowflakes
        ctx.fillStyle = '#FFFFFF';
        snowflakes.forEach((s) => {
          ctx.beginPath();
          ctx.globalAlpha = s.opacity;
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();

          s.y += s.speed;
          s.x += Math.sin(s.y * 0.02) * s.sway;
          if (s.y > canvas.height) {
            s.y = -10;
            s.x = Math.random() * canvas.width;
          }
        });
      } else if (activeKey === 'Night') {
        // Draw Twinkling Stars
        stars.forEach((st) => {
          st.alpha += st.alphaChange;
          if (st.alpha >= 1 || st.alpha <= 0.1) st.alphaChange *= -1;

          ctx.fillStyle = '#E0E7FF';
          ctx.globalAlpha = Math.max(0.1, Math.min(1, st.alpha));
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeKey]);

  return (
    <>
      {/* Background Gradient Layer A */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: bgLayers.gradA,
          backgroundAttachment: 'fixed',
          opacity: bgLayers.activeLayer === 'A' ? 1 : 0,
          transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: -2,
        }}
      />

      {/* Background Gradient Layer B */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: bgLayers.gradB,
          backgroundAttachment: 'fixed',
          opacity: bgLayers.activeLayer === 'B' ? 1 : 0,
          transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <div className="weather-ambient" aria-hidden="true">
        {/* Canvas for Rain, Thunderstorm, Snow, and Night Stars */}
        <canvas ref={canvasRef} className="weather-canvas" />

        {/* Primary Ambient Light Orb - Shifts color with 600ms CSS transitions */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: '55vw',
            height: '55vw',
            maxWidth: '650px',
            maxHeight: '650px',
            background: `radial-gradient(circle, ${theme?.ambientColor || 'rgba(251, 191, 36, 0.35)'} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(70px)',
            transition: 'background 600ms ease, opacity 600ms ease',
          }}
        />

        {/* Secondary Ambient Light Orb - Bottom Left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '45vw',
            height: '45vw',
            maxWidth: '550px',
            maxHeight: '550px',
            background: `radial-gradient(circle, ${theme?.ambientSecondary || 'rgba(245, 158, 11, 0.2)'} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.8,
            transition: 'background 600ms ease, opacity 600ms ease',
          }}
        />

        {/* DOM Animated Fog / Cloud Overlays */}
        {(activeKey === 'Clouds' || activeKey === 'Mist' || activeKey === 'PartlyCloudy') && (
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '40%',
              background:
                activeKey === 'Mist'
                  ? 'linear-gradient(180deg, rgba(203, 213, 225, 0.18) 0%, transparent 100%)'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
              pointerEvents: 'none',
              animation: 'fogShift 12s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </>
  );
}
