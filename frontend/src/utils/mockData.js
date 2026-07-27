/**
 * Mock Weather Data for Demo Mode when no OpenWeather API Key is provided
 */

export const MOCK_CITIES = [
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Cairo', country: 'EG', lat: 30.0444, lon: 31.2357 },
  { name: 'San Francisco', country: 'US', lat: 37.7749, lon: -122.4194 },
];

export const MOCK_WEATHER_DATABASE = {
  London: {
    current: {
      coord: { lon: -0.1278, lat: 51.5074 },
      weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
      main: { temp: 18.5, feels_like: 18.2, temp_min: 15.0, temp_max: 21.0, pressure: 1014, humidity: 68 },
      visibility: 10000,
      wind: { speed: 4.1, deg: 230 },
      sys: { country: 'GB', sunrise: 1722053100, sunset: 1722109800 },
      timezone: 3600,
      name: 'London',
    },
    forecast: generateMockForecast('Clouds', 18.5, '03d'),
    pollution: { list: [{ main: { aqi: 2 }, components: { pm2_5: 12.4, pm10: 22.1, no2: 18.5, o3: 45.2, so2: 3.1, co: 210.5 } }] }
  },

  'New York': {
    current: {
      coord: { lon: -74.006, lat: 40.7128 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 27.8, feels_like: 29.1, temp_min: 24.0, temp_max: 30.5, pressure: 1018, humidity: 54 },
      visibility: 10000,
      wind: { speed: 3.6, deg: 180 },
      sys: { country: 'US', sunrise: 1722035400, sunset: 1722087600 },
      timezone: -14400,
      name: 'New York',
    },
    forecast: generateMockForecast('Clear', 27.8, '01d'),
    pollution: { list: [{ main: { aqi: 1 }, components: { pm2_5: 7.2, pm10: 14.3, no2: 12.1, o3: 52.0, so2: 1.8, co: 180.0 } }] }
  },

  Tokyo: {
    current: {
      coord: { lon: 139.6503, lat: 35.6762 },
      weather: [{ id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' }],
      main: { temp: 22.3, feels_like: 23.0, temp_min: 20.0, temp_max: 24.5, pressure: 1008, humidity: 88 },
      visibility: 8000,
      wind: { speed: 5.8, deg: 90 },
      sys: { country: 'JP', sunrise: 1721984400, sunset: 1722035700 },
      timezone: 32400,
      name: 'Tokyo',
    },
    forecast: generateMockForecast('Rain', 22.3, '10d'),
    pollution: { list: [{ main: { aqi: 2 }, components: { pm2_5: 15.8, pm10: 28.4, no2: 24.0, o3: 38.5, so2: 4.2, co: 290.0 } }] }
  },

  Sydney: {
    current: {
      coord: { lon: 151.2093, lat: -33.8688 },
      weather: [{ id: 800, main: 'Clear', description: 'sunny clear sky', icon: '01d' }],
      main: { temp: 19.2, feels_like: 19.0, temp_min: 14.0, temp_max: 21.0, pressure: 1022, humidity: 50 },
      visibility: 10000,
      wind: { speed: 3.1, deg: 310 },
      sys: { country: 'AU', sunrise: 1721941200, sunset: 1721978400 },
      timezone: 36000,
      name: 'Sydney',
    },
    forecast: generateMockForecast('Clear', 19.2, '01d'),
    pollution: { list: [{ main: { aqi: 1 }, components: { pm2_5: 5.1, pm10: 9.8, no2: 8.5, o3: 40.2, so2: 1.0, co: 140.0 } }] }
  },

  Paris: {
    current: {
      coord: { lon: 2.3522, lat: 48.8566 },
      weather: [{ id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
      main: { temp: 20.1, feels_like: 20.0, temp_min: 17.0, temp_max: 23.0, pressure: 1016, humidity: 62 },
      visibility: 10000,
      wind: { speed: 3.8, deg: 210 },
      sys: { country: 'FR', sunrise: 1722053400, sunset: 1722109200 },
      timezone: 7200,
      name: 'Paris',
    },
    forecast: generateMockForecast('Clouds', 20.1, '04d'),
    pollution: { list: [{ main: { aqi: 2 }, components: { pm2_5: 11.2, pm10: 20.5, no2: 19.4, o3: 42.0, so2: 2.5, co: 220.0 } }] }
  },

  Cairo: {
    current: {
      coord: { lon: 31.2357, lat: 30.0444 },
      weather: [{ id: 800, main: 'Clear', description: 'hot sunny sky', icon: '01d' }],
      main: { temp: 36.4, feels_like: 38.2, temp_min: 30.0, temp_max: 39.0, pressure: 1006, humidity: 32 },
      visibility: 10000,
      wind: { speed: 4.6, deg: 340 },
      sys: { country: 'EG', sunrise: 1722046200, sunset: 1722095400 },
      timezone: 10800,
      name: 'Cairo',
    },
    forecast: generateMockForecast('Clear', 36.4, '01d'),
    pollution: { list: [{ main: { aqi: 3 }, components: { pm2_5: 38.5, pm10: 72.4, no2: 35.1, o3: 65.0, so2: 8.4, co: 510.0 } }] }
  },

  'San Francisco': {
    current: {
      coord: { lon: -122.4194, lat: 37.7749 },
      weather: [{ id: 701, main: 'Mist', description: 'foggy morning', icon: '50d' }],
      main: { temp: 16.8, feels_like: 16.5, temp_min: 13.0, temp_max: 19.5, pressure: 1015, humidity: 82 },
      visibility: 6000,
      wind: { speed: 5.2, deg: 270 },
      sys: { country: 'US', sunrise: 1722037800, sunset: 1722089400 },
      timezone: -25200,
      name: 'San Francisco',
    },
    forecast: generateMockForecast('Mist', 16.8, '50d'),
    pollution: { list: [{ main: { aqi: 1 }, components: { pm2_5: 6.8, pm10: 12.1, no2: 10.5, o3: 35.0, so2: 1.5, co: 160.0 } }] }
  }
};

function generateMockForecast(mainCond, baseTemp, icon) {
  const list = [];
  const nowUnix = Math.floor(Date.now() / 1000);
  // Generate 40 3-hour entries (5 days)
  for (let i = 0; i < 40; i++) {
    const dt = nowUnix + i * 3 * 3600;
    // Temp fluctuation curve
    const cycle = Math.sin((i / 8) * Math.PI * 2);
    const temp = Math.round((baseTemp + cycle * 4 + (Math.random() * 2 - 1)) * 10) / 10;
    
    list.push({
      dt,
      main: { temp, feels_like: temp - 0.5, temp_min: temp - 2, temp_max: temp + 2, humidity: 65 },
      weather: [{ id: 800, main: mainCond, description: mainCond.toLowerCase(), icon }],
      wind: { speed: 3.5, deg: 180 },
      dt_txt: new Date(dt * 1000).toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  return { list, city: { name: 'Mock City', country: 'MC' } };
}

export function searchMockGeocoding(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return MOCK_CITIES.filter(c => c.name.toLowerCase().includes(q)).map(c => ({
    name: c.name,
    country: c.country,
    state: c.country === 'US' ? 'State' : undefined,
    lat: c.lat,
    lon: c.lon,
  }));
}
