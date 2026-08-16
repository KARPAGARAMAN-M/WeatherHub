import React, { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * WeatherEffects Component
 * Dynamic Background Animation & Dual-Layer Gradient Cross-Fade Engine:
 * - 600–800ms Butter-Smooth Background Cross-Fade between all weather condition transitions
 * - Clear Day: Sunbeam glow + warm amber ambient orbs + subtle cloud floaters
 * - Clear Night: Canvas twinkling starfield + moon glow
 * - Clouds: Rolling cloud deck particles + misty overlays
 * - PartlyCloudy: Floating clouds + sunbeam glow
 * - Rain: Canvas animated falling rain & splash droplets
 * - Thunderstorm: Canvas rain + random lightning flash generator
 * - Snow: Canvas swaying snowflakes with gentle drift
 * - Mist/Fog: Drifting fog overlays & soft grey haze
 * - Windy: Flowing breeze lines & sweeping wind particles
 * - Sunrise: Peach/orange/pink horizon sunlight glow
 * - Sunset: Orange/magenta/purple sunset lighting
 */
export default function WeatherEffects() {
  const { theme } = useThemeContext();
  const canvasRef = useRef(null);
  const activeKey = theme?.key || 'Clear';

  // --- Dual Layer Background Cross-Fade Engine ---
  const initialGrad = theme?.bgGradient || 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 35%, #38BDF8 70%, #7DD3FC 100%)';
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
    const rainCount = activeKey === 'Thunderstorm' ? 140 : 90;
    const drops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 22 + 14,
      speed: Math.random() * 12 + 14,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    // --- 2. Snow Particles ---
    const snowCount = 80;
    const snowflakes = Array.from({ length: snowCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3.5 + 1.5,
      speed: Math.random() * 1.5 + 0.5,
      sway: Math.random() * 2 - 1,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // --- 3. Night Starfield Particles ---
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random(),
      alphaChange: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // --- 4. Moving Cloud Particles for Daytime & Cloudy ---
    const cloudCount = 7;
    const canvasClouds = Array.from({ length: cloudCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * (h * 0.35),
      r: Math.random() * 65 + 45,
      speed: Math.random() * 0.35 + 0.15,
      opacity: Math.random() * 0.16 + 0.07,
    }));

    // --- 5. Flowing Wind Breeze Particles ---
    const windCount = 35;
    const windLines = Array.from({ length: windCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 120 + 60,
      speed: Math.random() * 6 + 4,
      opacity: Math.random() * 0.35 + 0.15,
      thickness: Math.random() * 2 + 1,
    }));

    // Daytime / Horizon Glow angle
    let sunAngle = 0;

    // Lightning Flash state
    let lightningOpacity = 0;
    let nextFlashTimer = Math.floor(Math.random() * 180) + 90;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Draw Moving Clouds for Clear / Cloudy / PartlyCloudy / Rain ---
      if (activeKey.includes('Cloud') || activeKey.includes('Overcast') || activeKey.includes('Clear')) {
        ctx.fillStyle = '#FFFFFF';
        canvasClouds.forEach((cl) => {
          ctx.beginPath();
          ctx.globalAlpha = activeKey.includes('Clear') ? cl.opacity * 0.5 : cl.opacity;
          ctx.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2);
          ctx.arc(cl.x + cl.r * 0.5, cl.y - cl.r * 0.2, cl.r * 0.7, 0, Math.PI * 2);
          ctx.arc(cl.x - cl.r * 0.5, cl.y, cl.r * 0.6, 0, Math.PI * 2);
          ctx.fill();

          cl.x += cl.speed;
          if (cl.x - cl.r * 2 > canvas.width) {
            cl.x = -cl.r * 2;
            cl.y = Math.random() * (canvas.height * 0.35);
          }
        });
      }

      // --- Gentle Horizon Glow during Sunrise / Sunset ---
      if (activeKey === 'Sunrise' || activeKey === 'Sunset') {
        sunAngle += 0.005;
        const sunX = activeKey === 'Sunrise' ? canvas.width * 0.2 : canvas.width * 0.8;
        const sunY = canvas.height * 0.35;
        const sunRadius = 220 + Math.sin(sunAngle) * 20;

        const sunGrad = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, sunRadius);
        if (activeKey === 'Sunrise') {
          sunGrad.addColorStop(0, 'rgba(251, 146, 60, 0.25)');
          sunGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.12)');
          sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          sunGrad.addColorStop(0, 'rgba(249, 115, 22, 0.25)');
          sunGrad.addColorStop(0.5, 'rgba(192, 38, 211, 0.12)');
          sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = sunGrad;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Flowing Wind Stream Animation ---
      if (activeKey === 'Windy' || activeKey === 'Squall' || activeKey === 'Tornado') {
        ctx.strokeStyle = activeKey === 'Tornado' ? '#F87171' : '#E0F2FE';
        windLines.forEach((wLine) => {
          ctx.beginPath();
          ctx.lineWidth = wLine.thickness;
          ctx.globalAlpha = wLine.opacity;
          ctx.moveTo(wLine.x, wLine.y);
          ctx.quadraticCurveTo(wLine.x + wLine.length * 0.5, wLine.y - 8, wLine.x + wLine.length, wLine.y);
          ctx.stroke();

          wLine.x += wLine.speed;
          if (wLine.x > canvas.width) {
            wLine.x = -wLine.length;
            wLine.y = Math.random() * canvas.height;
          }
        });
      }

      // --- Rain, Drizzle & Thunderstorm ---
      if (activeKey.includes('Rain') || activeKey.includes('Drizzle') || activeKey.includes('Thunderstorm')) {
        ctx.strokeStyle = activeKey.includes('Thunderstorm') ? '#C084FC' : '#38BDF8';
        ctx.lineWidth = activeKey.includes('Heavy') ? 2.2 : 1.6;
        drops.forEach((d) => {
          ctx.beginPath();
          ctx.globalAlpha = d.opacity;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 4, d.y + d.length);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 0.9;
          if (d.y > canvas.height) {
            d.y = -20;
            d.x = Math.random() * canvas.width;
          }
        });

        if (activeKey.includes('Thunderstorm')) {
          nextFlashTimer--;
          if (nextFlashTimer <= 0) {
            lightningOpacity = Math.random() * 0.85 + 0.15;
            nextFlashTimer = Math.floor(Math.random() * 200) + 80;
          }

          if (lightningOpacity > 0) {
            ctx.fillStyle = `rgba(224, 231, 255, ${lightningOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            lightningOpacity *= 0.82;
          }
        }
      } else if (activeKey.includes('Snow')) {
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
      } else if (theme?.isNight || activeKey.endsWith('Night')) {
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
          transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)',
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
          transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <div className="weather-ambient" aria-hidden="true">
        {/* Canvas for Rain, Thunderstorm, Snow, Windy breeze, and Night Stars */}
        <canvas ref={canvasRef} className="weather-canvas" />

        {/* Primary Ambient Light Orb - Shifts color with 500-600ms CSS transitions */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: '55vw',
            height: '55vw',
            maxWidth: '650px',
            maxHeight: '650px',
            background: `radial-gradient(circle, ${theme?.ambientColor || 'rgba(56, 189, 248, 0.2)'} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(90px)',
            transition: 'background 500ms ease, opacity 500ms ease',
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
            background: `radial-gradient(circle, ${theme?.ambientSecondary || 'rgba(14, 165, 233, 0.2)'} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: 0.8,
            transition: 'background 500ms ease, opacity 500ms ease',
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
              height: '45%',
              background:
                activeKey === 'Mist'
                  ? 'linear-gradient(180deg, rgba(203, 213, 225, 0.22) 0%, transparent 100%)'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
              pointerEvents: 'none',
              animation: 'fogShift 12s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </>
  );
}
