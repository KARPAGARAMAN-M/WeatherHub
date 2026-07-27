/**
 * Weather Theme Utility
 * Maps OpenWeather main condition to dynamic theme tokens and CSS custom properties.
 */

export const WEATHER_PALETTES = {
  Clear: {
    name: 'Sunny',
    mainColor: '#FFD54F',
    skyColor: '#87CEEB',
    accentColor: '#7CB342',
    textColor: '#FFFFFF',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(255, 213, 79, 0.3)',
    bgGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #f7b731 100%)',
    ambientEffect: 'sunny',
    iconColor: '#FFD54F',
  },
  Clouds: {
    name: 'Cloudy',
    mainColor: '#D3D3D3',
    skyColor: '#708090',
    accentColor: '#6A8CAF',
    textColor: '#F5F5F5',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(211, 211, 211, 0.25)',
    bgGradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
    ambientEffect: 'clouds',
    iconColor: '#E0E0E0',
  },
  Rain: {
    name: 'Rainy',
    mainColor: '#4A90E2',
    skyColor: '#1E3A5F',
    accentColor: '#4DB6AC',
    textColor: '#FFFFFF',
    cardBg: 'rgba(30, 58, 95, 0.4)',
    cardBorder: 'rgba(74, 144, 226, 0.3)',
    bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    ambientEffect: 'rain',
    iconColor: '#4A90E2',
  },
  Drizzle: {
    name: 'Drizzle',
    mainColor: '#4A90E2',
    skyColor: '#1E3A5F',
    accentColor: '#4DB6AC',
    textColor: '#FFFFFF',
    cardBg: 'rgba(30, 58, 95, 0.35)',
    cardBorder: 'rgba(74, 144, 226, 0.25)',
    bgGradient: 'linear-gradient(135deg, #132735 0%, #1f4257 100%)',
    ambientEffect: 'rain',
    iconColor: '#4DB6AC',
  },
  Thunderstorm: {
    name: 'Stormy',
    mainColor: '#36454F',
    skyColor: '#4B3F72',
    accentColor: '#FDD835',
    textColor: '#FFFFFF',
    cardBg: 'rgba(38, 50, 56, 0.5)',
    cardBorder: 'rgba(253, 216, 53, 0.35)',
    bgGradient: 'linear-gradient(135deg, #190A28 0%, #28153A 50%, #141E30 100%)',
    ambientEffect: 'storm',
    iconColor: '#FDD835',
  },
  Snow: {
    name: 'Snowy',
    mainColor: '#FFFFFF',
    skyColor: '#D6F0FF',
    accentColor: '#A7C7E7',
    textColor: '#FFFFFF',
    cardBg: 'rgba(255, 255, 255, 0.2)',
    cardBorder: 'rgba(214, 240, 255, 0.4)',
    bgGradient: 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)',
    ambientEffect: 'snow',
    iconColor: '#E0F7FA',
  },
  Atmosphere: {
    name: 'Misty',
    mainColor: '#B0BEC5',
    skyColor: '#455A64',
    accentColor: '#D1C4E9',
    textColor: '#ECEFF1',
    cardBg: 'rgba(69, 90, 100, 0.35)',
    cardBorder: 'rgba(176, 190, 197, 0.3)',
    bgGradient: 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)',
    ambientEffect: 'fog',
    iconColor: '#D1C4E9',
  },
};

// Aliases for OWM atmospheric conditions (Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado)
const ATMOSPHERE_TYPES = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'];

export function getThemeForCondition(conditionStr) {
  if (!conditionStr) return WEATHER_PALETTES.Clear;
  
  if (WEATHER_PALETTES[conditionStr]) {
    return WEATHER_PALETTES[conditionStr];
  }

  if (ATMOSPHERE_TYPES.includes(conditionStr)) {
    return WEATHER_PALETTES.Atmosphere;
  }

  // Default fallback
  return WEATHER_PALETTES.Clear;
}

export function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.mainColor);
  root.style.setProperty('--color-sky', theme.skyColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-card-bg', theme.cardBg);
  root.style.setProperty('--color-card-border', theme.cardBorder);
  root.style.setProperty('--bg-gradient', theme.bgGradient);
  root.style.setProperty('--color-icon', theme.iconColor);
}
