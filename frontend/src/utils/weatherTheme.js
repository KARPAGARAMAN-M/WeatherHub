/**
 * Dynamic Weather Themes & Visual Condition System
 * Provides 20+ distinct weather visual themes with explicit Day and Night variants:
 * Clear, Mostly Clear, Partly Cloudy, Mostly Cloudy, Overcast, Light Rain, Moderate Rain,
 * Heavy Rain, Drizzle, Thunderstorm, Snow, Fog, Mist, Haze, Smoke, Dust, Sand, Squall, Tornado, Sunrise, Sunset.
 */

export const WEATHER_THEMES = {
  // --- Clear Sky ---
  ClearDay: {
    key: 'ClearDay',
    name: 'Clear Sky',
    emoji: '☀️',
    isNight: false,
    primary: '#38BDF8',
    sky: '#0EA5E9',
    accent: '#F59E0B',
    primaryGlow: 'rgba(56, 189, 248, 0.25)',
    bgGradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 35%, #0EA5E9 70%, #38BDF8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.16)',
    cardBorder: 'rgba(255, 255, 255, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.8)',
    ambientColor: 'rgba(56, 189, 248, 0.25)',
    ambientSecondary: 'rgba(245, 158, 11, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.22)',
    badgeText: '#FFFFFF',
  },
  ClearNight: {
    key: 'ClearNight',
    name: 'Clear Night Sky',
    emoji: '🌙',
    isNight: true,
    primary: '#818CF8',
    sky: '#6366F1',
    accent: '#38BDF8',
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

  // --- Mostly Clear ---
  MostlyClearDay: {
    key: 'MostlyClearDay',
    name: 'Mostly Clear',
    emoji: '🌤️',
    isNight: false,
    primary: '#38BDF8',
    sky: '#0284C7',
    accent: '#FBBF24',
    primaryGlow: 'rgba(56, 189, 248, 0.3)',
    bgGradient: 'linear-gradient(135deg, #0369A1 0%, #0284C7 40%, #38BDF8 75%, #7DD3FC 100%)',
    cardBg: 'rgba(255, 255, 255, 0.16)',
    cardBorder: 'rgba(255, 255, 255, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.8)',
    ambientColor: 'rgba(56, 189, 248, 0.3)',
    ambientSecondary: 'rgba(251, 191, 36, 0.2)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.25)',
    badgeText: '#FFFFFF',
  },
  MostlyClearNight: {
    key: 'MostlyClearNight',
    name: 'Mostly Clear Night',
    emoji: '🌌',
    isNight: true,
    primary: '#A5B4FC',
    sky: '#4338CA',
    accent: '#38BDF8',
    primaryGlow: 'rgba(165, 180, 252, 0.4)',
    bgGradient: 'linear-gradient(135deg, #050B14 0%, #0F172A 40%, #1E1B4B 75%, #3730A3 100%)',
    cardBg: 'rgba(30, 41, 59, 0.5)',
    cardBorder: 'rgba(165, 180, 252, 0.3)',
    cardHoverBorder: 'rgba(165, 180, 252, 0.75)',
    ambientColor: 'rgba(165, 180, 252, 0.35)',
    ambientSecondary: 'rgba(99, 102, 241, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(165, 180, 252, 0.25)',
    badgeText: '#E0E7FF',
  },

  // --- Partly Cloudy ---
  PartlyCloudyDay: {
    key: 'PartlyCloudyDay',
    name: 'Partly Cloudy',
    emoji: '🌤️',
    isNight: false,
    primary: '#38BDF8',
    sky: '#60A5FA',
    accent: '#F59E0B',
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
  PartlyCloudyNight: {
    key: 'PartlyCloudyNight',
    name: 'Partly Cloudy Night',
    emoji: '☁️',
    isNight: true,
    primary: '#818CF8',
    sky: '#475569',
    accent: '#38BDF8',
    primaryGlow: 'rgba(129, 140, 248, 0.4)',
    bgGradient: 'linear-gradient(135deg, #0B132B 0%, #1C2541 40%, #3B4B68 75%, #4B5563 100%)',
    cardBg: 'rgba(30, 41, 59, 0.55)',
    cardBorder: 'rgba(129, 140, 248, 0.35)',
    cardHoverBorder: 'rgba(129, 140, 248, 0.8)',
    ambientColor: 'rgba(129, 140, 248, 0.35)',
    ambientSecondary: 'rgba(71, 85, 105, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(129, 140, 248, 0.28)',
    badgeText: '#E0E7FF',
  },

  // --- Mostly Cloudy ---
  MostlyCloudyDay: {
    key: 'MostlyCloudyDay',
    name: 'Mostly Cloudy',
    emoji: '🌥️',
    isNight: false,
    primary: '#CBD5E1',
    sky: '#64748B',
    accent: '#38BDF8',
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
  MostlyCloudyNight: {
    key: 'MostlyCloudyNight',
    name: 'Mostly Cloudy Night',
    emoji: '☁️',
    isNight: true,
    primary: '#94A3B8',
    sky: '#334155',
    accent: '#818CF8',
    primaryGlow: 'rgba(148, 163, 184, 0.35)',
    bgGradient: 'linear-gradient(135deg, #070D18 0%, #0F172A 40%, #1E293B 75%, #334155 100%)',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    cardBorder: 'rgba(148, 163, 184, 0.3)',
    cardHoverBorder: 'rgba(203, 213, 225, 0.75)',
    ambientColor: 'rgba(148, 163, 184, 0.3)',
    ambientSecondary: 'rgba(51, 65, 85, 0.3)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.85)',
    badgeBg: 'rgba(148, 163, 184, 0.25)',
    badgeText: '#F8FAFC',
  },

  // --- Overcast ---
  OvercastDay: {
    key: 'OvercastDay',
    name: 'Overcast',
    emoji: '☁️',
    isNight: false,
    primary: '#94A3B8',
    sky: '#475569',
    accent: '#64748B',
    primaryGlow: 'rgba(148, 163, 184, 0.3)',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #334155 75%, #475569 100%)',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(148, 163, 184, 0.3)',
    cardHoverBorder: 'rgba(203, 213, 225, 0.7)',
    ambientColor: 'rgba(148, 163, 184, 0.25)',
    ambientSecondary: 'rgba(71, 85, 105, 0.25)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.85)',
    badgeBg: 'rgba(148, 163, 184, 0.22)',
    badgeText: '#F8FAFC',
  },
  OvercastNight: {
    key: 'OvercastNight',
    name: 'Overcast Night',
    emoji: '☁️',
    isNight: true,
    primary: '#64748B',
    sky: '#1E293B',
    accent: '#94A3B8',
    primaryGlow: 'rgba(100, 116, 139, 0.35)',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0F172A 40%, #1E293B 80%, #334155 100%)',
    cardBg: 'rgba(15, 23, 42, 0.65)',
    cardBorder: 'rgba(100, 116, 139, 0.35)',
    cardHoverBorder: 'rgba(148, 163, 184, 0.75)',
    ambientColor: 'rgba(100, 116, 139, 0.3)',
    ambientSecondary: 'rgba(30, 41, 59, 0.35)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(203, 213, 225, 0.85)',
    badgeBg: 'rgba(100, 116, 139, 0.25)',
    badgeText: '#F8FAFC',
  },

  // --- Light Rain ---
  LightRainDay: {
    key: 'LightRainDay',
    name: 'Light Rain',
    emoji: '🌦️',
    isNight: false,
    primary: '#38BDF8',
    sky: '#0284C7',
    accent: '#60A5FA',
    primaryGlow: 'rgba(56, 189, 248, 0.4)',
    bgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 40%, #0369A1 75%, #38BDF8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(56, 189, 248, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.8)',
    ambientColor: 'rgba(56, 189, 248, 0.35)',
    ambientSecondary: 'rgba(2, 132, 199, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#E0F2FE',
  },
  LightRainNight: {
    key: 'LightRainNight',
    name: 'Light Rain Night',
    emoji: '🌧️',
    isNight: true,
    primary: '#38BDF8',
    sky: '#1E293B',
    accent: '#818CF8',
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #0F172A 40%, #0C4A6E 75%, #0284C7 100%)',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    cardBorder: 'rgba(56, 189, 248, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.8)',
    ambientColor: 'rgba(56, 189, 248, 0.38)',
    ambientSecondary: 'rgba(129, 140, 248, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#E0F2FE',
  },

  // --- Moderate Rain ---
  ModerateRainDay: {
    key: 'ModerateRainDay',
    name: 'Moderate Rain',
    emoji: '🌧️',
    isNight: false,
    primary: '#0EA5E9',
    sky: '#0369A1',
    accent: '#38BDF8',
    primaryGlow: 'rgba(14, 165, 233, 0.45)',
    bgGradient: 'linear-gradient(135deg, #071E3D 0%, #0C4A6E 40%, #0284C7 75%, #0EA5E9 100%)',
    cardBg: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(14, 165, 233, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.85)',
    ambientColor: 'rgba(14, 165, 233, 0.4)',
    ambientSecondary: 'rgba(3, 105, 161, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(14, 165, 233, 0.28)',
    badgeText: '#E0F2FE',
  },
  ModerateRainNight: {
    key: 'ModerateRainNight',
    name: 'Moderate Rain Night',
    emoji: '🌧️',
    isNight: true,
    primary: '#38BDF8',
    sky: '#070F26',
    accent: '#60A5FA',
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #070F26 40%, #0F172A 70%, #0369A1 100%)',
    cardBg: 'rgba(7, 15, 38, 0.65)',
    cardBorder: 'rgba(56, 189, 248, 0.35)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.8)',
    ambientColor: 'rgba(56, 189, 248, 0.38)',
    ambientSecondary: 'rgba(2, 132, 199, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(56, 189, 248, 0.28)',
    badgeText: '#E0F2FE',
  },

  // --- Heavy Rain ---
  HeavyRainDay: {
    key: 'HeavyRainDay',
    name: 'Heavy Rain',
    emoji: '🌧️',
    isNight: false,
    primary: '#38BDF8',
    sky: '#0284C7',
    accent: '#60A5FA',
    primaryGlow: 'rgba(56, 189, 248, 0.5)',
    bgGradient: 'linear-gradient(135deg, #051329 0%, #09254A 40%, #0C4A6E 75%, #0284C7 100%)',
    cardBg: 'rgba(9, 37, 74, 0.6)',
    cardBorder: 'rgba(56, 189, 248, 0.4)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.9)',
    ambientColor: 'rgba(56, 189, 248, 0.45)',
    ambientSecondary: 'rgba(2, 132, 199, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.3)',
    badgeText: '#E0F2FE',
  },
  HeavyRainNight: {
    key: 'HeavyRainNight',
    name: 'Heavy Rain Night',
    emoji: '⛈️',
    isNight: true,
    primary: '#38BDF8',
    sky: '#030712',
    accent: '#60A5FA',
    primaryGlow: 'rgba(56, 189, 248, 0.55)',
    bgGradient: 'linear-gradient(135deg, #02040A 0%, #070F26 40%, #0F172A 70%, #0C4A6E 100%)',
    cardBg: 'rgba(7, 15, 38, 0.7)',
    cardBorder: 'rgba(56, 189, 248, 0.4)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.9)',
    ambientColor: 'rgba(56, 189, 248, 0.45)',
    ambientSecondary: 'rgba(129, 140, 248, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.3)',
    badgeText: '#E0F2FE',
  },

  // --- Drizzle ---
  DrizzleDay: {
    key: 'DrizzleDay',
    name: 'Drizzle',
    emoji: '🌦️',
    isNight: false,
    primary: '#38BDF8',
    sky: '#0EA5E9',
    accent: '#93C5FD',
    primaryGlow: 'rgba(56, 189, 248, 0.35)',
    bgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 40%, #38BDF8 75%, #7DD3FC 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(56, 189, 248, 0.32)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.75)',
    ambientColor: 'rgba(56, 189, 248, 0.35)',
    ambientSecondary: 'rgba(14, 165, 233, 0.22)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    badgeBg: 'rgba(56, 189, 248, 0.25)',
    badgeText: '#F0F9FF',
  },
  DrizzleNight: {
    key: 'DrizzleNight',
    name: 'Drizzle Night',
    emoji: '🌧️',
    isNight: true,
    primary: '#7DD3FC',
    sky: '#0F172A',
    accent: '#38BDF8',
    primaryGlow: 'rgba(125, 211, 252, 0.4)',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #0F172A 40%, #1E293B 75%, #0C4A6E 100%)',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    cardBorder: 'rgba(125, 211, 252, 0.35)',
    cardHoverBorder: 'rgba(125, 211, 252, 0.8)',
    ambientColor: 'rgba(125, 211, 252, 0.35)',
    ambientSecondary: 'rgba(56, 189, 248, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.88)',
    badgeBg: 'rgba(125, 211, 252, 0.28)',
    badgeText: '#E0F2FE',
  },

  // --- Thunderstorm ---
  ThunderstormDay: {
    key: 'ThunderstormDay',
    name: 'Thunderstorm',
    emoji: '⛈️',
    isNight: false,
    primary: '#C084FC',
    sky: '#A855F7',
    accent: '#22D3EE',
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
  ThunderstormNight: {
    key: 'ThunderstormNight',
    name: 'Thunderstorm Night',
    emoji: '⛈️',
    isNight: true,
    primary: '#E9D5FF',
    sky: '#1E1B4B',
    accent: '#F472B6',
    primaryGlow: 'rgba(233, 213, 255, 0.6)',
    bgGradient: 'linear-gradient(135deg, #030208 0%, #0F081C 40%, #1E0A3C 75%, #3B0764 100%)',
    cardBg: 'rgba(15, 8, 28, 0.7)',
    cardBorder: 'rgba(233, 213, 255, 0.4)',
    cardHoverBorder: 'rgba(233, 213, 255, 0.9)',
    ambientColor: 'rgba(233, 213, 255, 0.5)',
    ambientSecondary: 'rgba(192, 132, 252, 0.35)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.92)',
    badgeBg: 'rgba(233, 213, 255, 0.3)',
    badgeText: '#F3E8FF',
  },

  // --- Snow ---
  SnowDay: {
    key: 'SnowDay',
    name: 'Snowfall',
    emoji: '❄️',
    isNight: false,
    primary: '#7DD3FC',
    sky: '#BAE6FD',
    accent: '#F0F9FF',
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
  SnowNight: {
    key: 'SnowNight',
    name: 'Snowfall Night',
    emoji: '❄️',
    isNight: true,
    primary: '#E0F2FE',
    sky: '#1E293B',
    accent: '#38BDF8',
    primaryGlow: 'rgba(224, 242, 254, 0.5)',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #0B192C 40%, #1E3A8A 75%, #0284C7 100%)',
    cardBg: 'rgba(11, 25, 44, 0.65)',
    cardBorder: 'rgba(224, 242, 254, 0.4)',
    cardHoverBorder: 'rgba(224, 242, 254, 0.85)',
    ambientColor: 'rgba(224, 242, 254, 0.4)',
    ambientSecondary: 'rgba(125, 211, 252, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(241, 245, 249, 0.9)',
    badgeBg: 'rgba(224, 242, 254, 0.3)',
    badgeText: '#F0F9FF',
  },

  // --- Fog ---
  FogDay: {
    key: 'FogDay',
    name: 'Fog',
    emoji: '🌫️',
    isNight: false,
    primary: '#CBD5E1',
    sky: '#94A3B8',
    accent: '#A1A1AA',
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
  FogNight: {
    key: 'FogNight',
    name: 'Foggy Night',
    emoji: '🌫️',
    isNight: true,
    primary: '#94A3B8',
    sky: '#18181B',
    accent: '#71717A',
    primaryGlow: 'rgba(148, 163, 184, 0.35)',
    bgGradient: 'linear-gradient(135deg, #09090B 0%, #18181B 40%, #27272A 75%, #3F3F46 100%)',
    cardBg: 'rgba(24, 24, 27, 0.65)',
    cardBorder: 'rgba(113, 113, 122, 0.35)',
    cardHoverBorder: 'rgba(148, 163, 184, 0.7)',
    ambientColor: 'rgba(148, 163, 184, 0.25)',
    ambientSecondary: 'rgba(39, 39, 42, 0.3)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(212, 212, 216, 0.85)',
    badgeBg: 'rgba(148, 163, 184, 0.25)',
    badgeText: '#F1F5F9',
  },

  // --- Mist ---
  MistDay: {
    key: 'MistDay',
    name: 'Mist',
    emoji: '🌫️',
    isNight: false,
    primary: '#CBD5E1',
    sky: '#64748B',
    accent: '#38BDF8',
    primaryGlow: 'rgba(203, 213, 225, 0.35)',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #475569 75%, #94A3B8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(203, 213, 225, 0.32)',
    cardHoverBorder: 'rgba(241, 245, 249, 0.75)',
    ambientColor: 'rgba(203, 213, 225, 0.3)',
    ambientSecondary: 'rgba(56, 189, 248, 0.2)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.85)',
    badgeBg: 'rgba(203, 213, 225, 0.25)',
    badgeText: '#F1F5F9',
  },
  MistNight: {
    key: 'MistNight',
    name: 'Misty Night',
    emoji: '🌫️',
    isNight: true,
    primary: '#94A3B8',
    sky: '#0F172A',
    accent: '#818CF8',
    primaryGlow: 'rgba(148, 163, 184, 0.35)',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0F172A 40%, #1E293B 75%, #475569 100%)',
    cardBg: 'rgba(15, 23, 42, 0.65)',
    cardBorder: 'rgba(148, 163, 184, 0.35)',
    cardHoverBorder: 'rgba(203, 213, 225, 0.75)',
    ambientColor: 'rgba(148, 163, 184, 0.28)',
    ambientSecondary: 'rgba(129, 140, 248, 0.2)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(203, 213, 225, 0.85)',
    badgeBg: 'rgba(148, 163, 184, 0.25)',
    badgeText: '#F1F5F9',
  },

  // --- Haze ---
  HazeDay: {
    key: 'HazeDay',
    name: 'Haze',
    emoji: '🌁',
    isNight: false,
    primary: '#F59E0B',
    sky: '#78350F',
    accent: '#FBBF24',
    primaryGlow: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'linear-gradient(135deg, #2A1A08 0%, #451A03 40%, #78350F 75%, #D97706 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(245, 158, 11, 0.35)',
    cardHoverBorder: 'rgba(251, 191, 36, 0.8)',
    ambientColor: 'rgba(245, 158, 11, 0.4)',
    ambientSecondary: 'rgba(217, 119, 6, 0.25)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(254, 243, 199, 0.88)',
    badgeBg: 'rgba(245, 158, 11, 0.28)',
    badgeText: '#FEF3C7',
  },
  HazeNight: {
    key: 'HazeNight',
    name: 'Hazy Night',
    emoji: '🌁',
    isNight: true,
    primary: '#D97706',
    sky: '#1C1917',
    accent: '#F59E0B',
    primaryGlow: 'rgba(217, 119, 6, 0.45)',
    bgGradient: 'linear-gradient(135deg, #0C0A09 0%, #1C1917 40%, #292524 75%, #451A03 100%)',
    cardBg: 'rgba(28, 25, 23, 0.65)',
    cardBorder: 'rgba(217, 119, 6, 0.35)',
    cardHoverBorder: 'rgba(245, 158, 11, 0.8)',
    ambientColor: 'rgba(217, 119, 6, 0.35)',
    ambientSecondary: 'rgba(120, 53, 15, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(254, 243, 199, 0.85)',
    badgeBg: 'rgba(217, 119, 6, 0.28)',
    badgeText: '#FEF3C7',
  },

  // --- Smoke / Dust / Sand / Squall / Tornado ---
  Smoke: {
    key: 'Smoke',
    name: 'Smoke',
    emoji: '💨',
    isNight: false,
    primary: '#A1A1AA',
    sky: '#3F3F46',
    accent: '#F59E0B',
    primaryGlow: 'rgba(161, 161, 170, 0.4)',
    bgGradient: 'linear-gradient(135deg, #09090B 0%, #18181B 40%, #27272A 75%, #52525B 100%)',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(161, 161, 170, 0.35)',
    cardHoverBorder: 'rgba(212, 212, 216, 0.75)',
    ambientColor: 'rgba(161, 161, 170, 0.3)',
    ambientSecondary: 'rgba(82, 82, 91, 0.25)',
    textColor: '#F8FAFC',
    textSecondary: 'rgba(226, 232, 240, 0.85)',
    badgeBg: 'rgba(161, 161, 170, 0.25)',
    badgeText: '#F1F5F9',
  },
  Dust: {
    key: 'Dust',
    name: 'Dust',
    emoji: '🧹',
    isNight: false,
    primary: '#D97706',
    sky: '#78350F',
    accent: '#FBBF24',
    primaryGlow: 'rgba(217, 119, 6, 0.45)',
    bgGradient: 'linear-gradient(135deg, #1C1917 0%, #292524 40%, #451A03 75%, #78350F 100%)',
    cardBg: 'rgba(41, 37, 36, 0.65)',
    cardBorder: 'rgba(217, 119, 6, 0.35)',
    cardHoverBorder: 'rgba(251, 191, 36, 0.8)',
    ambientColor: 'rgba(217, 119, 6, 0.4)',
    ambientSecondary: 'rgba(120, 53, 15, 0.3)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(254, 243, 199, 0.88)',
    badgeBg: 'rgba(217, 119, 6, 0.3)',
    badgeText: '#FEF3C7',
  },
  Sand: {
    key: 'Sand',
    name: 'Sandstorm',
    emoji: '🏜️',
    isNight: false,
    primary: '#F59E0B',
    sky: '#B45309',
    accent: '#FDE047',
    primaryGlow: 'rgba(245, 158, 11, 0.5)',
    bgGradient: 'linear-gradient(135deg, #451A03 0%, #78350F 40%, #9A3412 75%, #D97706 100%)',
    cardBg: 'rgba(120, 53, 15, 0.55)',
    cardBorder: 'rgba(245, 158, 11, 0.4)',
    cardHoverBorder: 'rgba(253, 224, 71, 0.85)',
    ambientColor: 'rgba(245, 158, 11, 0.45)',
    ambientSecondary: 'rgba(180, 83, 9, 0.35)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(254, 243, 199, 0.9)',
    badgeBg: 'rgba(245, 158, 11, 0.3)',
    badgeText: '#FEF3C7',
  },
  Squall: {
    key: 'Squall',
    name: 'Squall',
    emoji: '💨',
    isNight: false,
    primary: '#38BDF8',
    sky: '#0284C7',
    accent: '#E0F2FE',
    primaryGlow: 'rgba(56, 189, 248, 0.5)',
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
  Tornado: {
    key: 'Tornado',
    name: 'Tornado',
    emoji: '🌪️',
    isNight: false,
    primary: '#EF4444',
    sky: '#991B1B',
    accent: '#F87171',
    primaryGlow: 'rgba(239, 68, 68, 0.6)',
    bgGradient: 'linear-gradient(135deg, #180202 0%, #450A0A 40%, #7F1D1D 75%, #991B1B 100%)',
    cardBg: 'rgba(69, 10, 10, 0.65)',
    cardBorder: 'rgba(239, 68, 68, 0.45)',
    cardHoverBorder: 'rgba(248, 113, 113, 0.9)',
    ambientColor: 'rgba(239, 68, 68, 0.5)',
    ambientSecondary: 'rgba(153, 27, 27, 0.4)',
    textColor: '#FFFFFF',
    textSecondary: 'rgba(254, 226, 226, 0.92)',
    badgeBg: 'rgba(239, 68, 68, 0.32)',
    badgeText: '#FEE2E2',
  },

  // --- Sunrise & Sunset ---
  Sunrise: {
    key: 'Sunrise',
    name: 'Sunrise',
    emoji: '🌅',
    isNight: false,
    primary: '#FB923C',
    sky: '#F43F5E',
    accent: '#FDE047',
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
    isNight: false,
    primary: '#F97316',
    sky: '#C026D3',
    accent: '#E11D48',
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

// Backward Compatibility Aliases
WEATHER_THEMES.Clear = WEATHER_THEMES.ClearDay;
WEATHER_THEMES.Night = WEATHER_THEMES.ClearNight;
WEATHER_THEMES.Clouds = WEATHER_THEMES.MostlyCloudyDay;
WEATHER_THEMES.PartlyCloudy = WEATHER_THEMES.PartlyCloudyDay;
WEATHER_THEMES.Rain = WEATHER_THEMES.ModerateRainDay;
WEATHER_THEMES.Thunderstorm = WEATHER_THEMES.ThunderstormDay;
WEATHER_THEMES.Snow = WEATHER_THEMES.SnowDay;
WEATHER_THEMES.Mist = WEATHER_THEMES.MistDay;
WEATHER_THEMES.Windy = WEATHER_THEMES.Squall;

/**
 * Centralized Weather Condition & Visual Evaluation Engine
 * Logic: API Weather Code + Cloud Coverage % + Precipitation + Time of Day -> Theme Object
 */
export function getThemeForCondition(conditionMain = '', iconCode = '', sys = null, dt = null, extraMetrics = {}) {
  const nowSec = dt || Math.floor(Date.now() / 1000);
  let isNight = false;
  let isSunriseSunset = false;
  let isNearSunrise = false;
  let isNearSunset = false;

  if (sys && sys.sunrise && sys.sunset) {
    const sr = sys.sunrise;
    const ss = sys.sunset;
    const margin = 2700; // 45 minutes

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
  const descLower = (extraMetrics.description || '').toLowerCase();
  const weatherId = extraMetrics.weatherId || extraMetrics.id || 0;
  const cloudPct = extraMetrics.clouds != null ? extraMetrics.clouds : null;
  const rainMm = extraMetrics.rainMm || 0;

  // 1. Sunrise / Sunset
  if (condLower.includes('sunrise') || (isSunriseSunset && isNearSunrise)) {
    return WEATHER_THEMES.Sunrise;
  }
  if (condLower.includes('sunset') || (isSunriseSunset && isNearSunset)) {
    return WEATHER_THEMES.Sunset;
  }

  // 2. Severe Atmospheric Hazards
  if (weatherId === 781 || condLower.includes('tornado') || descLower.includes('tornado')) {
    return WEATHER_THEMES.Tornado;
  }
  if (weatherId === 771 || condLower.includes('squall') || descLower.includes('squall')) {
    return WEATHER_THEMES.Squall;
  }
  if (weatherId === 751 || condLower.includes('sand') || descLower.includes('sand')) {
    return WEATHER_THEMES.Sand;
  }
  if (weatherId === 761 || weatherId === 731 || condLower.includes('dust') || descLower.includes('dust')) {
    return WEATHER_THEMES.Dust;
  }
  if (weatherId === 711 || condLower.includes('smoke') || descLower.includes('smoke')) {
    return WEATHER_THEMES.Smoke;
  }
  if (weatherId === 721 || condLower.includes('haze') || descLower.includes('haze')) {
    return isNight ? WEATHER_THEMES.HazeNight : WEATHER_THEMES.HazeDay;
  }
  if (weatherId === 741 || condLower.includes('fog') || descLower.includes('fog')) {
    return isNight ? WEATHER_THEMES.FogNight : WEATHER_THEMES.FogDay;
  }
  if (weatherId === 701 || condLower.includes('mist') || descLower.includes('mist')) {
    return isNight ? WEATHER_THEMES.MistNight : WEATHER_THEMES.MistDay;
  }

  // 3. Thunderstorm
  if ((weatherId >= 200 && weatherId <= 232) || condLower.includes('thunder') || descLower.includes('thunder')) {
    return isNight ? WEATHER_THEMES.ThunderstormNight : WEATHER_THEMES.ThunderstormDay;
  }

  // 4. Snow
  if ((weatherId >= 600 && weatherId <= 622) || condLower.includes('snow') || descLower.includes('snow')) {
    return isNight ? WEATHER_THEMES.SnowNight : WEATHER_THEMES.SnowDay;
  }

  // 5. Drizzle
  if ((weatherId >= 300 && weatherId <= 321) || condLower.includes('drizzle') || descLower.includes('drizzle')) {
    return isNight ? WEATHER_THEMES.DrizzleNight : WEATHER_THEMES.DrizzleDay;
  }

  // 6. Rain
  if ((weatherId >= 500 && weatherId <= 531) || condLower.includes('rain') || descLower.includes('rain')) {
    if (weatherId === 502 || weatherId === 503 || weatherId === 504 || weatherId === 522 || rainMm >= 7.5 || descLower.includes('heavy')) {
      return isNight ? WEATHER_THEMES.HeavyRainNight : WEATHER_THEMES.HeavyRainDay;
    }
    if (weatherId === 501 || weatherId === 521 || rainMm >= 2.5 || descLower.includes('moderate')) {
      return isNight ? WEATHER_THEMES.ModerateRainNight : WEATHER_THEMES.ModerateRainDay;
    }
    return isNight ? WEATHER_THEMES.LightRainNight : WEATHER_THEMES.LightRainDay;
  }

  // 7. Cloud Coverage & Clear Sky Evaluation
  let finalCloud = cloudPct;
  if (finalCloud == null) {
    if (weatherId === 800 || condLower === 'clear') finalCloud = 5;
    else if (weatherId === 801 || descLower.includes('few')) finalCloud = 20;
    else if (weatherId === 802 || descLower.includes('scattered') || descLower.includes('partly')) finalCloud = 45;
    else if (weatherId === 803 || descLower.includes('broken') || descLower.includes('mostly')) finalCloud = 75;
    else if (weatherId === 804 || descLower.includes('overcast')) finalCloud = 95;
    else finalCloud = 20;
  }

  if (finalCloud <= 10) {
    return isNight ? WEATHER_THEMES.ClearNight : WEATHER_THEMES.ClearDay;
  }
  if (finalCloud <= 30) {
    return isNight ? WEATHER_THEMES.MostlyClearNight : WEATHER_THEMES.MostlyClearDay;
  }
  if (finalCloud <= 60) {
    return isNight ? WEATHER_THEMES.PartlyCloudyNight : WEATHER_THEMES.PartlyCloudyDay;
  }
  if (finalCloud <= 85) {
    return isNight ? WEATHER_THEMES.MostlyCloudyNight : WEATHER_THEMES.MostlyCloudyDay;
  }
  return isNight ? WEATHER_THEMES.OvercastNight : WEATHER_THEMES.OvercastDay;
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
