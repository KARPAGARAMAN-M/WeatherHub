/**
 * Dynamic Weather Themes System
 * 11 distinct weather themes: Clear Day, Clear Night, Cloudy, Partly Cloudy, Rain, Thunderstorm, Snow, Mist/Fog, Windy, Sunrise, Sunset
 */

export const WEATHER_THEMES = {
  Clear: {
    key: 'Clear',
    name: 'Clear Day',
    emoji: '☀️',
    primary: '#FBBF24',        // Warm Sun Yellow
    sky: '#38BDF8',            // Luminous Sky Cyan
    accent: '#0EA5E9',         // Bright Sky Blue Accent
    primaryGlow: 'rgba(251, 191, 36, 0.45)',
    bgGradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 35%, #38BDF8 70%, #7DD3FC 100%)',
    cardBg: 'rgba(255, 255, 255, 0.16)',
    cardBorder: 'rgba(255, 255, 255, 0.35)',
    cardHoverBorder: 'rgba(251, 191, 36, 0.8)',
    ambientColor: 'rgba(251, 191, 36, 0.45)',
    ambientSecondary: 'rgba(14, 165, 233, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(251, 191, 36, 0.28)',
    badgeText: '#FFFBEB',
  },
  Night: {
    key: 'Night',
    name: 'Clear Night',
    emoji: '🌙',
    primary: '#818CF8',        // Moonlit Starlight Violet
    sky: '#6366F1',            // Moon Glow Indigo
    accent: '#38BDF8',         // Deep Blue Starlight
    primaryGlow: 'rgba(129, 140, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #0F172A 35%, #1E1B4B 70%, #311B92 100%)',
    cardBg: 'rgba(30, 41, 59, 0.45)',
    cardBorder: 'rgba(99, 102, 241, 0.35)',
    cardHoverBorder: 'rgba(129, 140, 248, 0.8)',
    ambientColor: 'rgba(129, 140, 248, 0.38)',
    ambientSecondary: 'rgba(99, 102, 241, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(129, 140, 248, 0.28)',
    badgeText: '#E0E7FF',
  },
  Clouds: {
    key: 'Clouds',
    name: 'Cloudy',
    emoji: '☁️',
    primary: '#CBD5E1',        // Silver Slate
    sky: '#64748B',            // Slate Blue Gray
    accent: '#94A3B8',         // Neutral Grey-Blue Accent
    primaryGlow: 'rgba(203, 213, 225, 0.35)',
    bgGradient: 'linear-gradient(135deg, #1E293B 0%, #334155 40%, #475569 75%, #64748B 100%)',
    cardBg: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(203, 213, 225, 0.3)',
    cardHoverBorder: 'rgba(241, 245, 249, 0.75)',
    ambientColor: 'rgba(148, 163, 184, 0.28)',
    ambientSecondary: 'rgba(71, 85, 105, 0.22)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(241, 245, 249, 0.85)',
    badgeBg: 'rgba(203, 213, 225, 0.22)',
    badgeText: '#F8FAFC',
  },
  PartlyCloudy: {
    key: 'PartlyCloudy',
    name: 'Partly Cloudy',
    emoji: '🌤️',
    primary: '#38BDF8',        // Luminous Sky Cyan
    sky: '#60A5FA',            // Soft Sky Blue
    accent: '#F59E0B',         // Sunbeam Amber Accent
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 40%, #38BDF8 75%, #93C5FD 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(255, 255, 255, 0.32)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.75)',
    ambientColor: 'rgba(56, 189, 248, 0.4)',
    ambientSecondary: 'rgba(245, 158, 11, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#F0F9FF',
  },
  Rain: {
    key: 'Rain',
    name: 'Rain',
    emoji: '🌧️',
    primary: '#38BDF8',        // Raindrop Cyan
    sky: '#0284C7',            // Deep Rain Slate Blue
    accent: '#60A5FA',         // Cool Blue Highlight
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #070F26 0%, #0F172A 40%, #1E293B 70%, #0284C7 100%)',
    cardBg: 'rgba(15, 23, 42, 0.55)',
    cardBorder: 'rgba(56, 189, 248, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.8)',
    ambientColor: 'rgba(56, 189, 248, 0.38)',
    ambientSecondary: 'rgba(2, 132, 199, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#E0F2FE',
  },
  Thunderstorm: {
    key: 'Thunderstorm',
    name: 'Thunderstorm',
    emoji: '⛈️',
    primary: '#C084FC',        // Electric Violet Bolt
    sky: '#A855F7',            // Dark Charcoal Purple Glow
    accent: '#22D3EE',         // Electric Cyan Spark
    primaryGlow: 'rgba(192, 132, 252, 0.55)',
    bgGradient: 'linear-gradient(135deg, #0B0914 0%, #180E29 40%, #2E1065 75%, #4C1D95 100%)',
    cardBg: 'rgba(24, 9, 38, 0.65)',
    cardBorder: 'rgba(192, 132, 252, 0.4)',
    cardHoverBorder: 'rgba(192, 132, 252, 0.85)',
    ambientColor: 'rgba(192, 132, 252, 0.45)',
    ambientSecondary: 'rgba(34, 211, 238, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(192, 132, 252, 0.3)',
    badgeText: '#F3E8FF',
  },
  Snow: {
    key: 'Snow',
    name: 'Snow',
    emoji: '❄️',
    primary: '#7DD3FC',        // Glacier Icy Blue
    sky: '#BAE6FD',            // Silver Frost White-Blue
    accent: '#F0F9FF',         // Crisp Snow Sparkle
    primaryGlow: 'rgba(186, 230, 253, 0.55)',
    bgGradient: 'linear-gradient(135deg, #092642 0%, #1E3A8A 35%, #0284C7 70%, #BAE6FD 100%)',
    cardBg: 'rgba(255, 255, 255, 0.2)',
    cardBorder: 'rgba(224, 242, 254, 0.45)',
    cardHoverBorder: 'rgba(186, 230, 253, 0.85)',
    ambientColor: 'rgba(186, 230, 253, 0.45)',
    ambientSecondary: 'rgba(125, 211, 252, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(224, 242, 254, 0.35)',
    badgeText: '#F0F9FF',
  },
  Mist: {
    key: 'Mist',
    name: 'Mist / Fog',
    emoji: '🌫️',
    primary: '#CBD5E1',        // Soft Silver Grey
    sky: '#94A3B8',            // Soft Misty Slate
    accent: '#A1A1AA',         // Muted Slate Haze
    primaryGlow: 'rgba(203, 213, 225, 0.4)',
    bgGradient: 'linear-gradient(135deg, #18181B 0%, #27272A 40%, #52525B 75%, #9CA3AF 100%)',
    cardBg: 'rgba(255, 255, 255, 0.13)',
    cardBorder: 'rgba(161, 161, 170, 0.3)',
    cardHoverBorder: 'rgba(203, 213, 225, 0.65)',
    ambientColor: 'rgba(203, 213, 225, 0.3)',
    ambientSecondary: 'rgba(161, 161, 170, 0.2)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.85)',
    badgeBg: 'rgba(203, 213, 225, 0.25)',
    badgeText: '#F1F5F9',
  },
  Windy: {
    key: 'Windy',
    name: 'Windy',
    emoji: '🌪️',
    primary: '#38BDF8',        // Breeze Sky Blue
    sky: '#7DD3FC',            // White-Blue Breeze
    accent: '#E0F2FE',         // Flowing Breeze Highlight
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #0369A1 0%, #0284C7 35%, #38BDF8 70%, #E0F2FE 100%)',
    cardBg: 'rgba(255, 255, 255, 0.16)',
    cardBorder: 'rgba(224, 242, 254, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.75)',
    ambientColor: 'rgba(56, 189, 248, 0.42)',
    ambientSecondary: 'rgba(224, 242, 254, 0.28)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#F0F9FF',
  },
  Sunrise: {
    key: 'Sunrise',
    name: 'Sunrise',
    emoji: '🌅',
    primary: '#FB923C',        // Soft Peach Orange
    sky: '#F43F5E',            // Pink Sun Glow
    accent: '#FDE047',         // Warm Sunlight Yellow
    primaryGlow: 'rgba(251, 146, 60, 0.5)',
    bgGradient: 'linear-gradient(135deg, #4C0519 0%, #9F1239 35%, #EA580C 70%, #FDBA74 100%)',
    cardBg: 'rgba(255, 255, 255, 0.16)',
    cardBorder: 'rgba(251, 146, 60, 0.4)',
    cardHoverBorder: 'rgba(251, 146, 60, 0.85)',
    ambientColor: 'rgba(251, 146, 60, 0.45)',
    ambientSecondary: 'rgba(244, 63, 94, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(251, 146, 60, 0.3)',
    badgeText: '#FFF7ED',
  },
  Sunset: {
    key: 'Sunset',
    name: 'Sunset',
    emoji: '🌇',
    primary: '#F97316',        // Deep Sunset Orange
    sky: '#C026D3',            // Soft Magenta Purple
    accent: '#E11D48',         // Crimson Red Lighting
    primaryGlow: 'rgba(249, 115, 22, 0.5)',
    bgGradient: 'linear-gradient(135deg, #2E1065 0%, #701A75 35%, #C026D3 65%, #F97316 100%)',
    cardBg: 'rgba(255, 255, 255, 0.16)',
    cardBorder: 'rgba(249, 115, 22, 0.4)',
    cardHoverBorder: 'rgba(192, 38, 211, 0.85)',
    ambientColor: 'rgba(249, 115, 22, 0.45)',
    ambientSecondary: 'rgba(192, 38, 211, 0.35)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(249, 115, 22, 0.3)',
    badgeText: '#FFF7ED',
  },
};

const ATMOSPHERE_TYPES = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'];

/**
 * Determine weather theme key based on condition string, OpenWeather icon code, and optional sys sunrise/sunset
 */
export function getThemeForCondition(conditionMain, iconCode = '', sys = null, dt = null) {
  let isNight = false;
  let isSunriseSunset = false;

  const nowSec = dt || Math.floor(Date.now() / 1000);

  let isNearSunrise = false;
  let isNearSunset = false;

  if (sys && sys.sunrise && sys.sunset) {
    const sr = sys.sunrise;
    const ss = sys.sunset;
    const margin = 2700; // 45 minutes in seconds

    if (Math.abs(nowSec - sr) <= margin) {
      isSunriseSunset = true;
      isNearSunrise = true;
    } else if (Math.abs(nowSec - ss) <= margin) {
      isSunriseSunset = true;
      isNearSunset = true;
    }

    if (nowSec < sr || nowSec > ss) {
      isNight = true;
    }
  } else if (iconCode && iconCode.endsWith('n')) {
    isNight = true;
  } else if (iconCode && iconCode.endsWith('d')) {
    isNight = false;
  }

  const condLower = (conditionMain || '').toLowerCase();
  const iconLower = (iconCode || '').toLowerCase();

  // If explicit Sunrise/Sunset condition or near sunrise/sunset and clear or partly cloudy
  if (condLower.includes('sunrise') || (isSunriseSunset && isNearSunrise)) {
    return WEATHER_THEMES.Sunrise;
  }

  if (condLower.includes('sunset') || (isSunriseSunset && isNearSunset)) {
    return WEATHER_THEMES.Sunset;
  }

  if (isSunriseSunset && (condLower === 'clear' || condLower === 'clouds' || iconLower.startsWith('01') || iconLower.startsWith('02'))) {
    return WEATHER_THEMES.Sunset;
  }

  // Windy / Breeze / Squall / Tornado
  if (condLower.includes('wind') || condLower.includes('breeze') || condLower.includes('gale') || condLower.includes('squall') || condLower.includes('tornado')) {
    return WEATHER_THEMES.Windy;
  }

  // If night and clear/partly cloudy, trigger Night theme
  if (isNight && (condLower === 'clear' || condLower === 'clouds' || iconLower === '01n' || iconLower === '02n')) {
    return WEATHER_THEMES.Night;
  }

  // Thunderstorm
  if (condLower.includes('thunder') || iconLower.startsWith('11')) {
    return WEATHER_THEMES.Thunderstorm;
  }

  // Snow
  if (condLower.includes('snow') || iconLower.startsWith('13')) {
    return WEATHER_THEMES.Snow;
  }

  // Rain or Drizzle
  if (condLower.includes('rain') || condLower.includes('drizzle') || iconLower.startsWith('09') || iconLower.startsWith('10')) {
    return WEATHER_THEMES.Rain;
  }

  // Mist / Fog / Atmosphere
  if (ATMOSPHERE_TYPES.some(t => t.toLowerCase() === condLower) || iconLower.startsWith('50')) {
    return WEATHER_THEMES.Mist;
  }

  // Clouds vs Partly Cloudy
  if (condLower.includes('cloud') || iconLower.startsWith('02') || iconLower.startsWith('03') || iconLower.startsWith('04')) {
    if (iconLower === '02d' || iconLower === '03d' || condLower.includes('few') || condLower.includes('scattered')) {
      return WEATHER_THEMES.PartlyCloudy;
    }
    return WEATHER_THEMES.Clouds;
  }

  // Clear / Sunny
  if (condLower === 'clear' || iconLower === '01d') {
    return isNight ? WEATHER_THEMES.Night : WEATHER_THEMES.Clear;
  }

  return isNight ? WEATHER_THEMES.Night : WEATHER_THEMES.Clear;
}

/**
 * Apply selected theme variables smoothly to DOM root with CSS variables
 */
export function applyThemeToDOM(theme) {
  if (!theme) return;
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-sky', theme.sky);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-primary-glow', theme.primaryGlow);
  root.style.setProperty('--bg-gradient', theme.bgGradient);
  root.style.setProperty('--card-bg', theme.cardBg);
  root.style.setProperty('--card-border', theme.cardBorder);
  root.style.setProperty('--card-border-hover', theme.cardHoverBorder);
  root.style.setProperty('--ambient-color', theme.ambientColor);
  root.style.setProperty('--ambient-secondary', theme.ambientSecondary);
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-text-secondary', theme.textSecondary);
  root.style.setProperty('--badge-bg', theme.badgeBg);
  root.style.setProperty('--badge-text', theme.badgeText);
}
