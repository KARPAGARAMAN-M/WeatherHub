import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * Modern SVG Animated Weather Icons for 8 Dynamic Themes:
 * - Clear (Sunny)
 * - PartlyCloudy
 * - Clouds (Cloudy)
 * - Rain
 * - Thunderstorm
 * - Snow
 * - Mist (Fog)
 * - Night
 */
export default function AnimatedWeatherIcon({ themeKey, size = 120, className = '' }) {
  const { theme } = useThemeContext();
  const activeKey = themeKey || theme?.key || 'Clear';

  const styleObj = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-block',
    verticalAlign: 'middle',
    filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.3))',
  };

  switch (activeKey) {
    case 'Clear':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Clear / Sunny">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF59D" stopOpacity="1" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Rotating Sun Rays */}
            <g transform="translate(50,50)">
              <g className="animate-spin-slow">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <line
                    key={i}
                    x1="0" y1="-38"
                    x2="0" y2="-46"
                    stroke="#FBBF24"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${deg})`}
                  />
                ))}
              </g>
              {/* Sun Core */}
              <circle cx="0" cy="0" r="26" fill="url(#sunGlow)" filter="url(#glow)" />
              <circle cx="0" cy="0" r="20" fill="#F59E0B" />
            </g>
          </svg>
        </div>
      );

    case 'PartlyCloudy':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Partly Cloudy">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <radialGradient id="partlySun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="70%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
              <linearGradient id="cloudGradPartly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>

            {/* Sun in background */}
            <g transform="translate(36,36)">
              <g className="animate-spin-slow">
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <line
                    key={i}
                    x1="0" y1="-26"
                    x2="0" y2="-32"
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${deg})`}
                  />
                ))}
              </g>
              <circle cx="0" cy="0" r="18" fill="url(#partlySun)" />
            </g>

            {/* Cloud in foreground */}
            <g className="animate-float" transform="translate(0, 10)">
              <path
                d="M30 68 H72 A16 16 0 0 0 72 36 A18 18 0 0 0 40 30 A18 18 0 0 0 30 68 Z"
                fill="url(#cloudGradPartly)"
                opacity="0.95"
              />
            </g>
          </svg>
        </div>
      );

    case 'Clouds':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Cloudy">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="cloudGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
              <linearGradient id="cloudGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#9CA3AF" />
              </linearGradient>
            </defs>

            {/* Back Cloud */}
            <g transform="translate(14, 16)" opacity="0.75">
              <path d="M25 55 H65 A14 14 0 0 0 65 27 A16 16 0 0 0 36 22 A15 15 0 0 0 25 55 Z" fill="url(#cloudGradBack)" />
            </g>

            {/* Front Cloud */}
            <g className="animate-float" transform="translate(4, 22)">
              <path d="M26 68 H74 A17 17 0 0 0 74 34 A20 20 0 0 0 38 28 A19 19 0 0 0 26 68 Z" fill="url(#cloudGradFront)" />
            </g>
          </svg>
        </div>
      );

    case 'Rain':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Rainy">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>

            {/* Cloud */}
            <path
              d="M26 50 H74 A17 17 0 0 0 74 16 A20 20 0 0 0 38 10 A19 19 0 0 0 26 50 Z"
              fill="url(#rainCloud)"
            />

            {/* Animated Rain Drops */}
            <g stroke="#38BDF8" strokeWidth="3" strokeLinecap="round">
              <line x1="34" y1="58" x2="28" y2="76" opacity="0.9">
                <animate attributeName="y1" values="54;62;54" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="y2" values="72;80;72" dur="0.8s" repeatCount="indefinite" />
              </line>
              <line x1="50" y1="58" x2="44" y2="76" opacity="0.9">
                <animate attributeName="y1" values="60;52;60" dur="0.7s" repeatCount="indefinite" />
                <animate attributeName="y2" values="78;70;78" dur="0.7s" repeatCount="indefinite" />
              </line>
              <line x1="66" y1="58" x2="60" y2="76" opacity="0.9">
                <animate attributeName="y1" values="56;64;56" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="y2" values="74;82;74" dur="0.9s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        </div>
      );

    case 'Thunderstorm':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Thunderstorm">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="stormCloud" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#1E1035" />
              </linearGradient>
              <filter id="lightningGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Storm Cloud */}
            <path
              d="M26 48 H74 A17 17 0 0 0 74 14 A20 20 0 0 0 38 8 A19 19 0 0 0 26 48 Z"
              fill="url(#stormCloud)"
            />

            {/* Rain Drops */}
            <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
              <line x1="32" y1="54" x2="26" y2="68" />
              <line x1="68" y1="54" x2="62" y2="68" />
            </g>

            {/* Flashing Lightning Bolt */}
            <polygon
              points="52,44 40,62 48,62 42,86 60,60 50,60"
              fill="#FBBF24"
              stroke="#FFF"
              strokeWidth="0.5"
              filter="url(#lightningGlow)"
            >
              <animate attributeName="opacity" values="1;0.2;1;0.9;0.1;1" dur="1.2s" repeatCount="indefinite" />
            </polygon>
          </svg>
        </div>
      );

    case 'Snow':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Snowy">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>

            {/* Snow Cloud */}
            <path
              d="M26 48 H74 A17 17 0 0 0 74 14 A20 20 0 0 0 38 8 A19 19 0 0 0 26 48 Z"
              fill="url(#snowCloud)"
            />

            {/* Rotating Snowflakes */}
            <g fill="none" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round">
              {/* Snowflake 1 */}
              <g transform="translate(36, 66)">
                <g className="animate-spin-slow">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="0" y1="-6" x2="0" y2="6" />
                  <line x1="-4" y1="-4" x2="4" y2="4" />
                  <line x1="-4" y1="4" x2="4" y2="-4" />
                </g>
              </g>
              {/* Snowflake 2 */}
              <g transform="translate(64, 66)">
                <g className="animate-spin-slow">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="0" y1="-6" x2="0" y2="6" />
                  <line x1="-4" y1="-4" x2="4" y2="4" />
                  <line x1="-4" y1="4" x2="4" y2="-4" />
                </g>
              </g>
              {/* Snowflake 3 center */}
              <g transform="translate(50, 78)">
                <g className="animate-spin-slow">
                  <line x1="-5" y1="0" x2="5" y2="0" />
                  <line x1="0" y1="-5" x2="0" y2="5" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      );

    case 'Mist':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Mist / Fog">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="fogLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#F8FAFC" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Drifting Horizontal Fog Ribbons */}
            <g stroke="url(#fogLineGrad)" strokeWidth="6" strokeLinecap="round">
              <line x1="15" y1="28" x2="85" y2="28">
                <animate attributeName="x1" values="10;20;10" dur="4s" repeatCount="indefinite" />
                <animate attributeName="x2" values="80;90;80" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="25" y1="44" x2="75" y2="44">
                <animate attributeName="x1" values="30;18;30" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="82;70;82" dur="3.5s" repeatCount="indefinite" />
              </line>
              <line x1="12" y1="60" x2="88" y2="60">
                <animate attributeName="x1" values="8;16;8" dur="4.5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="84;92;84" dur="4.5s" repeatCount="indefinite" />
              </line>
              <line x1="28" y1="76" x2="72" y2="76">
                <animate attributeName="x1" values="32;24;32" dur="3s" repeatCount="indefinite" />
                <animate attributeName="x2" values="76;68;76" dur="3s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        </div>
      );

    case 'Night':
    default:
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Night">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EEF2FF" />
                <stop offset="60%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
              <filter id="moonGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Crescent Moon */}
            <path
              d="M50 18 A28 28 0 1 0 78 70 A24 24 0 1 1 50 18 Z"
              fill="url(#moonGrad)"
              filter="url(#moonGlow)"
            />

            {/* Twinkling Star 1 */}
            <polygon
              points="74,24 76,30 82,32 76,34 74,40 72,34 66,32 72,30"
              fill="#E0E7FF"
            >
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </polygon>

            {/* Twinkling Star 2 */}
            <polygon
              points="30,22 31.5,26 36,27.5 31.5,29 30,33 28.5,29 24,27.5 28.5,26"
              fill="#BAE6FD"
              opacity="0.8"
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
            </polygon>
          </svg>
        </div>
      );
  }
}
