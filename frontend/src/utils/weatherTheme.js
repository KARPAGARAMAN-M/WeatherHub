/**
 * Dynamic Weather Themes System
 * 8 distinct weather themes: Clear/Sunny, Partly Cloudy, Cloudy, Rain, Thunderstorm, Snow, Mist/Fog, Night
 */

export const WEATHER_THEMES = {
  Clear: {
    key: 'Clear',
    name: 'Clear / Sunny',
    emoji: '☀️',
    primary: '#F59E0B',        // Vibrant Sun Gold
    sky: '#38BDF8',            // Luminous Sky Cyan
    accent: '#FF7E5F',         // Warm Coral Sunbeam
    primaryGlow: 'rgba(245, 158, 11, 0.45)',
    bgGradient: 'linear-gradient(135deg, #1C1917 0%, #78350F 35%, #D97706 70%, #FBBF24 100%)',
    cardBg: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(254, 215, 170, 0.3)',
    cardHoverBorder: 'rgba(251, 191, 36, 0.75)',
    ambientColor: 'rgba(251, 191, 36, 0.45)',
    ambientSecondary: 'rgba(245, 158, 11, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(245, 158, 11, 0.3)',
    badgeText: '#FFFBEB',
  },
  SunriseSunset: {
    key: 'SunriseSunset',
    name: 'Sunrise / Sunset',
    emoji: '🌅',
    primary: '#F97316',        // Golden Orange
    sky: '#EC4899',            // Warm Pink
    accent: '#F43F5E',         // Coral Sun Glow
    primaryGlow: 'rgba(249, 115, 22, 0.5)',
    bgGradient: 'linear-gradient(135deg, #2E1065 0%, #7C2D12 40%, #DB2777 75%, #F97316 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(251, 146, 60, 0.35)',
    cardHoverBorder: 'rgba(244, 63, 94, 0.75)',
    ambientColor: 'rgba(249, 115, 22, 0.45)',
    ambientSecondary: 'rgba(219, 39, 119, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(249, 115, 22, 0.3)',
    badgeText: '#FFF7ED',
  },
  PartlyCloudy: {
    key: 'PartlyCloudy',
    name: 'Partly Cloudy',
    emoji: '🌤️',
    primary: '#38BDF8',        // Cool Sky Cyan
    sky: '#60A5FA',            // Bright Sky Blue
    accent: '#F59E0B',         // Warm Sun Accent
    primaryGlow: 'rgba(56, 189, 248, 0.4)',
    bgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 40%, #38BDF8 75%, #93C5FD 100%)',
    cardBg: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(255, 255, 255, 0.3)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.7)',
    ambientColor: 'rgba(56, 189, 248, 0.38)',
    ambientSecondary: 'rgba(147, 197, 253, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.88)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#F0F9FF',
  },
  Clouds: {
    key: 'Clouds',
    name: 'Cloudy',
    emoji: '☁️',
    primary: '#94A3B8',        // Silver Slate
    sky: '#64748B',            // Slate Blue Gray
    accent: '#38BDF8',         // Soft Sky Accent
    primaryGlow: 'rgba(148, 163, 184, 0.35)',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #334155 75%, #64748B 100%)',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(203, 213, 225, 0.25)',
    cardHoverBorder: 'rgba(226, 232, 240, 0.6)',
    ambientColor: 'rgba(148, 163, 184, 0.25)',
    ambientSecondary: 'rgba(71, 85, 105, 0.2)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(241, 245, 249, 0.82)',
    badgeBg: 'rgba(148, 163, 184, 0.22)',
    badgeText: '#F8FAFC',
  },
  Rain: {
    key: 'Rain',
    name: 'Rainy',
    emoji: '🌧️',
    primary: '#38BDF8',        // Vibrant Raindrop Cyan
    sky: '#0284C7',            // Deep Rain Blue
    accent: '#60A5FA',         // Splash Highlight
    primaryGlow: 'rgba(14, 165, 233, 0.45)',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #0F172A 40%, #1E3A8A 75%, #0284C7 100%)',
    cardBg: 'rgba(15, 23, 42, 0.55)',
    cardBorder: 'rgba(56, 189, 248, 0.3)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.7)',
    ambientColor: 'rgba(14, 165, 233, 0.35)',
    ambientSecondary: 'rgba(2, 132, 199, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    badgeBg: 'rgba(56, 189, 248, 0.25)',
    badgeText: '#E0F2FE',
  },
  Thunderstorm: {
    key: 'Thunderstorm',
    name: 'Thunderstorm',
    emoji: '⛈️',
    primary: '#C084FC',        // Electric Violet Bolt
    sky: '#A855F7',            // Deep Purple Glow
    accent: '#22D3EE',         // Electric Cyan Spark
    primaryGlow: 'rgba(192, 132, 252, 0.5)',
    bgGradient: 'linear-gradient(135deg, #090514 0%, #2E1065 40%, #581C87 75%, #7E22CE 100%)',
    cardBg: 'rgba(24, 9, 38, 0.65)',
    cardBorder: 'rgba(192, 132, 252, 0.35)',
    cardHoverBorder: 'rgba(192, 132, 252, 0.8)',
    ambientColor: 'rgba(192, 132, 252, 0.42)',
    ambientSecondary: 'rgba(34, 211, 238, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.88)',
    badgeBg: 'rgba(192, 132, 252, 0.28)',
    badgeText: '#F3E8FF',
  },
  Snow: {
    key: 'Snow',
    name: 'Snowy',
    emoji: '❄️',
    primary: '#38BDF8',        // Glacier Ice Cyan
    sky: '#7DD3FC',            // Frost White-Blue
    accent: '#F0F9FF',         // Crisp Snowfall Sparkle
    primaryGlow: 'rgba(186, 230, 253, 0.5)',
    bgGradient: 'linear-gradient(135deg, #082F49 0%, #0369A1 40%, #38BDF8 75%, #BAE6FD 100%)',
    cardBg: 'rgba(255, 255, 255, 0.18)',
    cardBorder: 'rgba(224, 242, 254, 0.4)',
    cardHoverBorder: 'rgba(186, 230, 253, 0.8)',
    ambientColor: 'rgba(186, 230, 253, 0.4)',
    ambientSecondary: 'rgba(125, 211, 252, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(224, 242, 254, 0.3)',
    badgeText: '#F0F9FF',
  },
  Mist: {
    key: 'Mist',
    name: 'Mist / Fog',
    emoji: '🌫️',
    primary: '#CBD5E1',        // Silver Fog Slate
    sky: '#94A3B8',            // Soft Misty Gray
    accent: '#64748B',         // Deep Slate Haze
    primaryGlow: 'rgba(203, 213, 225, 0.35)',
    bgGradient: 'linear-gradient(135deg, #18181B 0%, #27272A 40%, #3F3F46 75%, #71717A 100%)',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(161, 161, 170, 0.25)',
    cardHoverBorder: 'rgba(203, 213, 225, 0.55)',
    ambientColor: 'rgba(203, 213, 225, 0.25)',
    ambientSecondary: 'rgba(148, 163, 184, 0.2)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.82)',
    badgeBg: 'rgba(203, 213, 225, 0.22)',
    badgeText: '#F1F5F9',
  },
  Night: {
    key: 'Night',
    name: 'Night',
    emoji: '🌙',
    primary: '#818CF8',        // Starlight Indigo Violet
    sky: '#6366F1',            // Moonlit Indigo
    accent: '#38BDF8',         // Deep Starlight Blue
    primaryGlow: 'rgba(129, 140, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #090D16 40%, #0F172A 75%, #1E1B4B 100%)',
    cardBg: 'rgba(15, 23, 42, 0.65)',
    cardBorder: 'rgba(99, 102, 241, 0.3)',
    cardHoverBorder: 'rgba(129, 140, 248, 0.7)',
    ambientColor: 'rgba(129, 140, 248, 0.35)',
    ambientSecondary: 'rgba(99, 102, 241, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    badgeBg: 'rgba(129, 140, 248, 0.28)',
    badgeText: '#E0E7FF',
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

  if (sys && sys.sunrise && sys.sunset) {
    const sr = sys.sunrise;
    const ss = sys.sunset;
    const margin = 2700; // 45 minutes in seconds

    if (Math.abs(nowSec - sr) <= margin || Math.abs(nowSec - ss) <= margin) {
      isSunriseSunset = true;
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

  // If near sunrise/sunset and clear or partly cloudy
  if (isSunriseSunset && (condLower === 'clear' || condLower === 'clouds' || iconLower.startsWith('01') || iconLower.startsWith('02'))) {
    return WEATHER_THEMES.SunriseSunset;
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
