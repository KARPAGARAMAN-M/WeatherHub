import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * Modern SVG Animated Weather Icons for 20+ Dynamic Themes & Day/Night Variants
 */
export default function AnimatedWeatherIcon({ themeKey, size = 120, className = '' }) {
  const { theme } = useThemeContext();
  const activeKey = themeKey || theme?.key || 'ClearDay';

  const styleObj = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-block',
    verticalAlign: 'middle',
    filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.35))',
  };

  switch (activeKey) {
    case 'Clear':
    case 'ClearDay':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Clear Sky">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF59D" stopOpacity="1" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
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
              <circle cx="0" cy="0" r="26" fill="url(#sunGlow)" filter="url(#glow)" />
              <circle cx="0" cy="0" r="20" fill="#F59E0B" />
            </g>
          </svg>
        </div>
      );

    case 'Night':
    case 'ClearNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Clear Night Sky">
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
            <path
              d="M50 18 A28 28 0 1 0 78 70 A24 24 0 1 1 50 18 Z"
              fill="url(#moonGrad)"
              filter="url(#moonGlow)"
            />
            <polygon points="74,24 76,30 82,32 76,34 74,40 72,34 66,32 72,30" fill="#E0E7FF">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </polygon>
            <polygon points="30,22 31.5,26 36,27.5 31.5,29 30,33 28.5,29 24,27.5 28.5,26" fill="#BAE6FD" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
            </polygon>
          </svg>
        </div>
      );

    case 'MostlyClearDay':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Mostly Clear">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g transform="translate(38,36)">
              <g className="animate-spin-slow">
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <line key={i} x1="0" y1="-26" x2="0" y2="-32" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${deg})`} />
                ))}
              </g>
              <circle cx="0" cy="0" r="18" fill="#F59E0B" />
            </g>
            <g className="animate-float" transform="translate(4, 18)" opacity="0.85">
              <path d="M30 62 H68 A14 14 0 0 0 68 34 A16 16 0 0 0 40 28 A15 15 0 0 0 30 62 Z" fill="#E2E8F0" />
            </g>
          </svg>
        </div>
      );

    case 'MostlyClearNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Mostly Clear Night">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M46 18 A24 24 0 1 0 70 64 A20 20 0 1 1 46 18 Z" fill="#818CF8" />
            <g className="animate-float" transform="translate(6, 16)" opacity="0.8">
              <path d="M30 64 H72 A14 14 0 0 0 72 36 A16 16 0 0 0 42 30 A15 15 0 0 0 30 64 Z" fill="#94A3B8" />
            </g>
          </svg>
        </div>
      );

    case 'PartlyCloudy':
    case 'PartlyCloudyDay':
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
            <g transform="translate(36,36)">
              <g className="animate-spin-slow">
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <line key={i} x1="0" y1="-26" x2="0" y2="-32" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${deg})`} />
                ))}
              </g>
              <circle cx="0" cy="0" r="18" fill="url(#partlySun)" />
            </g>
            <g className="animate-float" transform="translate(0, 10)">
              <path d="M30 68 H72 A16 16 0 0 0 72 36 A18 18 0 0 0 40 30 A18 18 0 0 0 30 68 Z" fill="url(#cloudGradPartly)" opacity="0.95" />
            </g>
          </svg>
        </div>
      );

    case 'PartlyCloudyNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Partly Cloudy Night">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M42 16 A22 22 0 1 0 66 60 A18 18 0 1 1 42 16 Z" fill="#818CF8" />
            <g className="animate-float" transform="translate(2, 12)">
              <path d="M28 66 H72 A16 16 0 0 0 72 34 A18 18 0 0 0 40 28 A17 17 0 0 0 28 66 Z" fill="#64748B" opacity="0.9" />
            </g>
          </svg>
        </div>
      );

    case 'Clouds':
    case 'MostlyCloudyDay':
    case 'MostlyCloudyNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Mostly Cloudy">
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
            <g transform="translate(14, 16)" opacity="0.75">
              <path d="M25 55 H65 A14 14 0 0 0 65 27 A16 16 0 0 0 36 22 A15 15 0 0 0 25 55 Z" fill="url(#cloudGradBack)" />
            </g>
            <g className="animate-float" transform="translate(4, 22)">
              <path d="M26 68 H74 A17 17 0 0 0 74 34 A20 20 0 0 0 38 28 A19 19 0 0 0 26 68 Z" fill="url(#cloudGradFront)" />
            </g>
          </svg>
        </div>
      );

    case 'OvercastDay':
    case 'OvercastNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Overcast">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <linearGradient id="overcastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>
            <g transform="translate(10, 10)" opacity="0.8">
              <path d="M22 55 H70 A16 16 0 0 0 70 23 A18 18 0 0 0 38 17 A17 17 0 0 0 22 55 Z" fill="#475569" />
            </g>
            <g className="animate-float" transform="translate(4, 20)">
              <path d="M26 68 H74 A17 17 0 0 0 74 34 A20 20 0 0 0 38 28 A19 19 0 0 0 26 68 Z" fill="url(#overcastGrad)" />
            </g>
          </svg>
        </div>
      );

    case 'LightRainDay':
    case 'LightRainNight':
    case 'DrizzleDay':
    case 'DrizzleNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Light Rain / Drizzle">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M26 50 H74 A17 17 0 0 0 74 16 A20 20 0 0 0 38 10 A19 19 0 0 0 26 50 Z" fill="#64748B" />
            <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
              <line x1="36" y1="58" x2="32" y2="70">
                <animate attributeName="y1" values="54;60;54" dur="1s" repeatCount="indefinite" />
                <animate attributeName="y2" values="66;72;66" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="52" y1="58" x2="48" y2="70">
                <animate attributeName="y1" values="58;52;58" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="y2" values="70;64;70" dur="0.9s" repeatCount="indefinite" />
              </line>
              <line x1="64" y1="58" x2="60" y2="70">
                <animate attributeName="y1" values="56;62;56" dur="1.1s" repeatCount="indefinite" />
                <animate attributeName="y2" values="68;74;68" dur="1.1s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        </div>
      );

    case 'Rain':
    case 'ModerateRainDay':
    case 'ModerateRainNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Rain">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M26 50 H74 A17 17 0 0 0 74 16 A20 20 0 0 0 38 10 A19 19 0 0 0 26 50 Z" fill="#334155" />
            <g stroke="#38BDF8" strokeWidth="3.2" strokeLinecap="round">
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

    case 'HeavyRainDay':
    case 'HeavyRainNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Heavy Rain">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M26 48 H74 A17 17 0 0 0 74 14 A20 20 0 0 0 38 8 A19 19 0 0 0 26 48 Z" fill="#1E293B" />
            <g stroke="#38BDF8" strokeWidth="3.8" strokeLinecap="round">
              <line x1="30" y1="54" x2="22" y2="78" opacity="0.95">
                <animate attributeName="y1" values="50;58;50" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="y2" values="74;82;74" dur="0.5s" repeatCount="indefinite" />
              </line>
              <line x1="44" y1="54" x2="36" y2="78" opacity="0.95">
                <animate attributeName="y1" values="56;48;56" dur="0.45s" repeatCount="indefinite" />
                <animate attributeName="y2" values="80;72;80" dur="0.45s" repeatCount="indefinite" />
              </line>
              <line x1="58" y1="54" x2="50" y2="78" opacity="0.95">
                <animate attributeName="y1" values="52;60;52" dur="0.52s" repeatCount="indefinite" />
                <animate attributeName="y2" values="76;84;76" dur="0.52s" repeatCount="indefinite" />
              </line>
              <line x1="72" y1="54" x2="64" y2="78" opacity="0.95">
                <animate attributeName="y1" values="54;46;54" dur="0.48s" repeatCount="indefinite" />
                <animate attributeName="y2" values="78;70;78" dur="0.48s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        </div>
      );

    case 'Thunderstorm':
    case 'ThunderstormDay':
    case 'ThunderstormNight':
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
            <path d="M26 48 H74 A17 17 0 0 0 74 14 A20 20 0 0 0 38 8 A19 19 0 0 0 26 48 Z" fill="url(#stormCloud)" />
            <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
              <line x1="32" y1="54" x2="26" y2="68" />
              <line x1="68" y1="54" x2="62" y2="68" />
            </g>
            <polygon points="52,44 40,62 48,62 42,86 60,60 50,60" fill="#FBBF24" stroke="#FFF" strokeWidth="0.5" filter="url(#lightningGlow)">
              <animate attributeName="opacity" values="1;0.2;1;0.9;0.1;1" dur="1.2s" repeatCount="indefinite" />
            </polygon>
          </svg>
        </div>
      );

    case 'Snow':
    case 'SnowDay':
    case 'SnowNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Snowfall">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M26 48 H74 A17 17 0 0 0 74 14 A20 20 0 0 0 38 8 A19 19 0 0 0 26 48 Z" fill="#94A3B8" />
            <g fill="none" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round">
              <g transform="translate(36, 66)">
                <g className="animate-spin-slow">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="0" y1="-6" x2="0" y2="6" />
                  <line x1="-4" y1="-4" x2="4" y2="4" />
                  <line x1="-4" y1="4" x2="4" y2="-4" />
                </g>
              </g>
              <g transform="translate(64, 66)">
                <g className="animate-spin-slow">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="0" y1="-6" x2="0" y2="6" />
                  <line x1="-4" y1="-4" x2="4" y2="4" />
                  <line x1="-4" y1="4" x2="4" y2="-4" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      );

    case 'Mist':
    case 'MistDay':
    case 'MistNight':
    case 'Fog':
    case 'FogDay':
    case 'FogNight':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Fog / Mist">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" opacity="0.9">
              <line x1="15" y1="30" x2="85" y2="30">
                <animate attributeName="x1" values="10;20;10" dur="4s" repeatCount="indefinite" />
                <animate attributeName="x2" values="80;90;80" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="25" y1="46" x2="75" y2="46">
                <animate attributeName="x1" values="30;18;30" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="82;70;82" dur="3.5s" repeatCount="indefinite" />
              </line>
              <line x1="12" y1="62" x2="88" y2="62">
                <animate attributeName="x1" values="8;16;8" dur="4.5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="84;92;84" dur="4.5s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        </div>
      );

    case 'HazeDay':
    case 'HazeNight':
    case 'Smoke':
    case 'Dust':
    case 'Sand':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Haze / Dust / Sand">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="38" r="18" fill="#F59E0B" opacity="0.85" />
            <g stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" opacity="0.75">
              <line x1="15" y1="58" x2="85" y2="58" />
              <line x1="22" y1="70" x2="78" y2="70" />
            </g>
          </svg>
        </div>
      );

    case 'Squall':
    case 'Windy':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Windy / Squall">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g stroke="#E0F2FE" strokeWidth="3.5" fill="none" strokeLinecap="round">
              <path d="M12 36 Q 55 32 75 36 A 6 6 0 1 0 75 26" opacity="0.95">
                <animate attributeName="stroke-dashoffset" values="0;20;0" dur="2.5s" repeatCount="indefinite" />
              </path>
              <path d="M22 52 Q 62 48 85 52 A 6 6 0 1 0 85 42" opacity="0.85">
                <animate attributeName="stroke-dashoffset" values="0;-20;0" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M15 68 Q 45 64 65 68 A 5 5 0 1 0 65 60" opacity="0.9">
                <animate attributeName="stroke-dashoffset" values="0;15;0" dur="3s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>
      );

    case 'Tornado':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Tornado">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g stroke="#F87171" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9">
              <line x1="15" y1="24" x2="85" y2="24" />
              <line x1="22" y1="38" x2="78" y2="38" />
              <line x1="30" y1="52" x2="70" y2="52" />
              <line x1="38" y1="66" x2="62" y2="66" />
              <line x1="46" y1="80" x2="54" y2="80" />
            </g>
          </svg>
        </div>
      );

    case 'Sunrise':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Sunrise">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g transform="translate(50, 48)">
              <circle cx="0" cy="0" r="22" fill="#FB923C" />
              {[-60, -30, 0, 30, 60].map((deg, i) => (
                <line key={i} x1="0" y1="-28" x2="0" y2="-36" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${deg})`} />
              ))}
            </g>
            <path d="M10 74 Q 50 68 90 74" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'Sunset':
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Sunset">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <g transform="translate(50, 52)">
              <circle cx="0" cy="0" r="22" fill="#F97316" />
              {[-50, -25, 0, 25, 50].map((deg, i) => (
                <line key={i} x1="0" y1="-28" x2="0" y2="-35" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${deg})`} />
              ))}
            </g>
            <path d="M10 76 Q 50 70 90 76" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );

    default:
      return (
        <div style={styleObj} className={`weather-icon-svg ${className}`} title="Clear Day">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="22" fill="#F59E0B" />
          </svg>
        </div>
      );
  }
}
