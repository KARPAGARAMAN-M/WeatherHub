/**
 * Dynamic Weather Themes System
 * 8 distinct weather themes: Clear/Sunny, Partly Cloudy, Cloudy, Rain, Thunderstorm, Snow, Mist/Fog, Night
 */

export const WEATHER_THEMES = {
  Clear: {
    key: 'Clear',
    name: 'Clear / Sunny',
    emoji: '☀️',
    primary: '#F59E0B',        // Golden Amber Accent
    sky: '#FBBF24',            // Warm Sun Gold
    accent: '#FF7E5F',         // Warm Coral Accent
    primaryGlow: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'linear-gradient(135deg, #1C0A00 0%, #78350F 35%, #D97706 70%, #FBBF24 100%)',
    cardBg: 'rgba(255, 247, 237, 0.12)',
    cardBorder: 'rgba(254, 215, 170, 0.25)',
    cardHoverBorder: 'rgba(245, 158, 11, 0.6)',
    ambientColor: 'rgba(251, 191, 36, 0.35)',
    ambientSecondary: 'rgba(245, 158, 11, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.82)',
    badgeBg: 'rgba(245, 158, 11, 0.25)',
    badgeText: '#FDE68A',
  },
  PartlyCloudy: {
    key: 'PartlyCloudy',
    name: 'Partly Cloudy',
    emoji: '🌤️',
    primary: '#38BDF8',        // Cool Sky Cyan
    sky: '#60A5FA',            // Bright Sky Blue
    accent: '#818CF8',         // Indigo Highlight
    primaryGlow: 'rgba(56, 189, 248, 0.4)',
    bgGradient: 'linear-gradient(135deg, #0B192C 0%, #1E3A8A 40%, #2563EB 75%, #60A5FA 100%)',
    cardBg: 'rgba(255, 255, 255, 0.11)',
    cardBorder: 'rgba(147, 197, 253, 0.25)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.6)',
    ambientColor: 'rgba(56, 189, 248, 0.32)',
    ambientSecondary: 'rgba(96, 165, 250, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.82)',
    badgeBg: 'rgba(56, 189, 248, 0.25)',
    badgeText: '#BAE6FD',
  },
  Clouds: {
    key: 'Clouds',
    name: 'Cloudy',
    emoji: '☁️',
    primary: '#9CA3AF',        // Silver Steel
    sky: '#6B7280',            // Slate Blue Gray
    accent: '#374151',         // Muted Dark Slate
    primaryGlow: 'rgba(156, 163, 175, 0.35)',
    bgGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 40%, #374151 75%, #4B5563 100%)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(156, 163, 175, 0.2)',
    cardHoverBorder: 'rgba(209, 213, 219, 0.5)',
    ambientColor: 'rgba(156, 163, 175, 0.22)',
    ambientSecondary: 'rgba(107, 114, 128, 0.15)',
    textColor: '#F9FAFB',
    textSecondary: 'rgba(243, 244, 246, 0.78)',
    badgeBg: 'rgba(156, 163, 175, 0.2)',
    badgeText: '#E5E7EB',
  },
  Rain: {
    key: 'Rain',
    name: 'Rainy',
    emoji: '🌧️',
    primary: '#38BDF8',        // Vibrant Raindrop Cyan
    sky: '#0284C7',            // Deep Rain Blue
    accent: '#0EA5E9',         // Ocean Accent
    primaryGlow: 'rgba(14, 165, 233, 0.45)',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #0F172A 40%, #1E293B 75%, #0284C7 100%)',
    cardBg: 'rgba(15, 23, 42, 0.65)',
    cardBorder: 'rgba(56, 189, 248, 0.25)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.65)',
    ambientColor: 'rgba(14, 165, 233, 0.35)',
    ambientSecondary: 'rgba(2, 132, 199, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.82)',
    badgeBg: 'rgba(56, 189, 248, 0.25)',
    badgeText: '#7DD3FC',
  },
  Thunderstorm: {
    key: 'Thunderstorm',
    name: 'Thunderstorm',
    emoji: '⛈️',
    primary: '#C084FC',        // Electric Violet Bolt
    sky: '#A855F7',            // Deep Purple Glow
    accent: '#22D3EE',         // Electric Cyan Spark
    primaryGlow: 'rgba(192, 132, 252, 0.5)',
    bgGradient: 'linear-gradient(135deg, #0D021A 0%, #1E0734 40%, #3B0764 75%, #581C87 100%)',
    cardBg: 'rgba(24, 9, 38, 0.68)',
    cardBorder: 'rgba(192, 132, 252, 0.3)',
    cardHoverBorder: 'rgba(192, 132, 252, 0.75)',
    ambientColor: 'rgba(192, 132, 252, 0.4)',
    ambientSecondary: 'rgba(34, 211, 238, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    badgeBg: 'rgba(192, 132, 252, 0.25)',
    badgeText: '#E9D5FF',
  },
  Snow: {
    key: 'Snow',
    name: 'Snowy',
    emoji: '❄️',
    primary: '#BAE6FD',        // Frost Ice White-Blue
    sky: '#7DD3FC',            // Icy Cyan Highlight
    accent: '#E0F2FE',         // Snow Crisp White
    primaryGlow: 'rgba(186, 230, 253, 0.45)',
    bgGradient: 'linear-gradient(135deg, #091524 0%, #1E293B 40%, #334155 70%, #64748B 100%)',
    cardBg: 'rgba(255, 255, 255, 0.13)',
    cardBorder: 'rgba(224, 242, 254, 0.35)',
    cardHoverBorder: 'rgba(186, 230, 253, 0.7)',
    ambientColor: 'rgba(186, 230, 253, 0.35)',
    ambientSecondary: 'rgba(125, 211, 252, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    badgeBg: 'rgba(224, 242, 254, 0.25)',
    badgeText: '#F0F9FF',
  },
  Mist: {
    key: 'Mist',
    name: 'Mist / Fog',
    emoji: '🌫️',
    primary: '#CBD5E1',        // Muted Silver Slate
    sky: '#94A3B8',            // Soft Misty Blue-Gray
    accent: '#64748B',         // Deep Slate Fog
    primaryGlow: 'rgba(203, 213, 225, 0.35)',
    bgGradient: 'linear-gradient(135deg, #18181B 0%, #27272A 40%, #3F3F46 75%, #71717A 100%)',
    cardBg: 'rgba(255, 255, 255, 0.07)',
    cardBorder: 'rgba(161, 161, 170, 0.2)',
    cardHoverBorder: 'rgba(203, 213, 225, 0.5)',
    ambientColor: 'rgba(203, 213, 225, 0.2)',
    ambientSecondary: 'rgba(148, 163, 184, 0.15)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.78)',
    badgeBg: 'rgba(203, 213, 225, 0.2)',
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
    cardBg: 'rgba(15, 23, 42, 0.72)',
    cardBorder: 'rgba(99, 102, 241, 0.25)',
    cardHoverBorder: 'rgba(129, 140, 248, 0.65)',
    ambientColor: 'rgba(129, 140, 248, 0.32)',
    ambientSecondary: 'rgba(99, 102, 241, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.82)',
    badgeBg: 'rgba(129, 140, 248, 0.25)',
    badgeText: '#C7D2FE',
  },
};

const ATMOSPHERE_TYPES = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'];

/**
 * Determine weather theme key based on condition string, OpenWeather icon code, and optional sys sunrise/sunset
 */
export function getThemeForCondition(conditionMain, iconCode = '', sys = null, dt = null) {
  // Check Night mode first if iconCode ends with 'n' or current time is outside sunrise/sunset
  let isNight = false;
  if (iconCode && iconCode.endsWith('n')) {
    isNight = true;
  } else if (sys && sys.sunrise && sys.sunset && dt) {
    if (dt < sys.sunrise || dt > sys.sunset) {
      isNight = true;
    }
  }

  const condLower = (conditionMain || '').toLowerCase();
  const iconLower = (iconCode || '').toLowerCase();

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
