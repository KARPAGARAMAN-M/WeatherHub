/**
 * Direct Client-Side Open-Meteo Meteorological Engine
 * Provides immediate live weather, 5-day forecast, air pollution, and geocoding directly in the browser
 * as a high-reliability fallback whenever the local backend proxy is offline or no API key is provided.
 */

const WMO_CODE_MAP = {
  0: { main: 'Clear', description: 'clear sky', iconDay: '01d', iconNight: '01n' },
  1: { main: 'Clear', description: 'mainly clear', iconDay: '01d', iconNight: '01n' },
  2: { main: 'Clouds', description: 'partly cloudy', iconDay: '02d', iconNight: '02n' },
  3: { main: 'Clouds', description: 'overcast clouds', iconDay: '04d', iconNight: '04n' },
  45: { main: 'Fog', description: 'foggy conditions', iconDay: '50d', iconNight: '50d' },
  48: { main: 'Fog', description: 'depositing rime fog', iconDay: '50d', iconNight: '50d' },
  51: { main: 'Drizzle', description: 'light drizzle', iconDay: '09d', iconNight: '09d' },
  53: { main: 'Drizzle', description: 'moderate drizzle', iconDay: '09d', iconNight: '09d' },
  55: { main: 'Drizzle', description: 'dense drizzle', iconDay: '09d', iconNight: '09d' },
  56: { main: 'Drizzle', description: 'light freezing drizzle', iconDay: '09d', iconNight: '09d' },
  57: { main: 'Drizzle', description: 'dense freezing drizzle', iconDay: '09d', iconNight: '09d' },
  61: { main: 'Rain', description: 'light rain', iconDay: '10d', iconNight: '10n' },
  63: { main: 'Rain', description: 'moderate rain', iconDay: '10d', iconNight: '10n' },
  65: { main: 'Rain', description: 'heavy rainfall', iconDay: '10d', iconNight: '10n' },
  66: { main: 'Rain', description: 'light freezing rain', iconDay: '10d', iconNight: '10n' },
  67: { main: 'Rain', description: 'heavy freezing rain', iconDay: '10d', iconNight: '10n' },
  71: { main: 'Snow', description: 'light snow fall', iconDay: '13d', iconNight: '13d' },
  73: { main: 'Snow', description: 'moderate snow fall', iconDay: '13d', iconNight: '13d' },
  75: { main: 'Snow', description: 'heavy snow fall', iconDay: '13d', iconNight: '13d' },
  77: { main: 'Snow', description: 'snow grains', iconDay: '13d', iconNight: '13d' },
  80: { main: 'Rain', description: 'slight rain showers', iconDay: '09d', iconNight: '09d' },
  81: { main: 'Rain', description: 'moderate rain showers', iconDay: '09d', iconNight: '09d' },
  82: { main: 'Rain', description: 'violent rain showers', iconDay: '09d', iconNight: '09d' },
  85: { main: 'Snow', description: 'slight snow showers', iconDay: '13d', iconNight: '13d' },
  86: { main: 'Snow', description: 'heavy snow showers', iconDay: '13d', iconNight: '13d' },
  95: { main: 'Thunderstorm', description: 'thunderstorm with rain', iconDay: '11d', iconNight: '11d' },
  96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', iconDay: '11d', iconNight: '11d' },
  99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', iconDay: '11d', iconNight: '11d' },
};

function mapWmoToWeather(wmoCode, isDay = true) {
  const meta = WMO_CODE_MAP[wmoCode] || { main: 'Clear', description: 'clear sky', iconDay: '01d', iconNight: '01n' };
  return {
    id: 800 + (wmoCode || 0),
    main: meta.main,
    description: meta.description,
    icon: isDay ? meta.iconDay : meta.iconNight,
  };
}

function parseIsoToEpochSeconds(isoStr) {
  if (!isoStr) return Math.floor(Date.now() / 1000);
  try {
    return Math.floor(new Date(isoStr + 'Z').getTime() / 1000);
  } catch (e) {
    return Math.floor(Date.now() / 1000);
  }
}

export async function fetchDirectOpenMeteoCurrent(lat, lon, locationDetails = {}) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max&wind_speed_unit=ms&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Open-Meteo weather fetch failed');
  const data = await res.json();

  const current = data.current || {};
  const daily = data.daily || {};
  const tzOffsetSeconds = data.utc_offset_seconds || 0;

  const temp = current.temperature_2m ?? 25;
  const feelsLike = current.apparent_temperature ?? temp;
  const humidity = current.relative_humidity_2m ?? 60;
  const pressure = current.surface_pressure ?? current.pressure_msl ?? 1013;
  const windSpeed = current.wind_speed_10m ?? 3;
  const windDeg = current.wind_direction_10m ?? 180;
  const windGusts = current.wind_gusts_10m ?? null;
  const clouds = current.cloud_cover ?? 20;
  const isDay = current.is_day === 1;
  const wmoCode = current.weather_code ?? 0;

  const tempMax = Array.isArray(daily.temperature_2m_max) && daily.temperature_2m_max[0] != null ? daily.temperature_2m_max[0] : temp + 3;
  const tempMin = Array.isArray(daily.temperature_2m_min) && daily.temperature_2m_min[0] != null ? daily.temperature_2m_min[0] : temp - 3;
  const uvMax = Array.isArray(daily.uv_index_max) && daily.uv_index_max[0] != null ? daily.uv_index_max[0] : 5;

  let sunriseEpoch = Math.floor(Date.now() / 1000) - 21600;
  let sunsetEpoch = Math.floor(Date.now() / 1000) + 21600;
  if (Array.isArray(daily.sunrise) && daily.sunrise[0]) {
    sunriseEpoch = parseIsoToEpochSeconds(daily.sunrise[0]) - tzOffsetSeconds;
  }
  if (Array.isArray(daily.sunset) && daily.sunset[0]) {
    sunsetEpoch = parseIsoToEpochSeconds(daily.sunset[0]) - tzOffsetSeconds;
  }

  const rainMm = (current.rain || 0) + (current.showers || 0);
  const snowMm = current.snowfall || 0;

  return {
    name: locationDetails.name || locationDetails.locality || locationDetails.city || 'Current Location',
    state: locationDetails.state || '',
    district: locationDetails.district || '',
    locality: locationDetails.locality || '',
    coord: { lat, lon },
    weather: [mapWmoToWeather(wmoCode, isDay)],
    main: {
      temp: Math.round(temp * 10) / 10,
      feels_like: Math.round(feelsLike * 10) / 10,
      temp_min: Math.round(tempMin * 10) / 10,
      temp_max: Math.round(tempMax * 10) / 10,
      pressure: Math.round(pressure),
      humidity: Math.round(humidity),
    },
    wind: {
      speed: Math.round(windSpeed * 10) / 10,
      deg: Math.round(windDeg),
      gust: windGusts != null ? Math.round(windGusts * 10) / 10 : undefined,
    },
    clouds: {
      all: Math.round(clouds),
    },
    rain: rainMm > 0 ? { '1h': Math.round(rainMm * 10) / 10 } : undefined,
    snow: snowMm > 0 ? { '1h': Math.round(snowMm * 10) / 10 } : undefined,
    visibility: 10000,
    dt: Math.floor(Date.now() / 1000),
    timezone: tzOffsetSeconds,
    elevation: data.elevation || 15,
    uv: Math.round(uvMax * 10) / 10,
    sys: {
      country: locationDetails.country || 'IN',
      sunrise: sunriseEpoch,
      sunset: sunsetEpoch,
    },
  };
}

export async function fetchDirectOpenMeteoForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Open-Meteo forecast fetch failed');
  const data = await res.json();

  const hourly = data.hourly || {};
  const timeList = hourly.time || [];
  const temp2mList = hourly.temperature_2m || [];
  const humidityList = hourly.relative_humidity_2m || [];
  const wmoCodeList = hourly.weather_code || [];
  const pressureList = hourly.surface_pressure || [];
  const windSpeedList = hourly.wind_speed_10m || [];
  const popList = hourly.precipitation_probability || [];
  const tzOffset = data.utc_offset_seconds || 0;

  const forecastList = [];
  for (let i = 0; i < timeList.length && forecastList.length < 40; i += 3) {
    const epochSec = parseIsoToEpochSeconds(timeList[i]) - tzOffset;
    const temp = temp2mList[i] ?? 25;
    const hum = humidityList[i] ?? 60;
    const code = wmoCodeList[i] ?? 0;
    const press = pressureList[i] ?? 1013;
    const windSpd = windSpeedList[i] ?? 3;
    const pop = (popList[i] ?? 0) / 100.0;

    const dateObj = new Date(epochSec * 1000);
    const hourOfSlot = dateObj.getUTCHours();
    const isDaySlot = hourOfSlot >= 6 && hourOfSlot < 19;

    forecastList.push({
      dt: epochSec,
      main: {
        temp: Math.round(temp * 10) / 10,
        feels_like: Math.round(temp * 10) / 10,
        temp_min: Math.round((temp - 1.5) * 10) / 10,
        temp_max: Math.round((temp + 1.5) * 10) / 10,
        humidity: Math.round(hum),
        pressure: Math.round(press),
      },
      weather: [mapWmoToWeather(code, isDaySlot)],
      wind: {
        speed: Math.round(windSpd * 10) / 10,
        deg: 180,
      },
      pop: Math.min(Math.max(pop, 0), 1),
      dt_txt: timeList[i],
    });
  }

  return { list: forecastList };
}

export async function fetchDirectOpenMeteoPollution(lat, lon) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Open-Meteo air quality fetch failed');
  const data = await res.json();

  const current = data.current || {};
  const eAqi = current.european_aqi ?? current.us_aqi ?? 25;

  let owAqi = 1;
  if (eAqi > 80) owAqi = 5;
  else if (eAqi > 60) owAqi = 4;
  else if (eAqi > 40) owAqi = 3;
  else if (eAqi > 20) owAqi = 2;

  return {
    list: [
      {
        main: { aqi: owAqi },
        components: {
          pm2_5: Math.round((current.pm2_5 ?? 12.0) * 10) / 10,
          pm10: Math.round((current.pm10 ?? 25.0) * 10) / 10,
          no2: Math.round((current.nitrogen_dioxide ?? 15.0) * 10) / 10,
          o3: Math.round((current.ozone ?? 45.0) * 10) / 10,
          so2: Math.round((current.sulphur_dioxide ?? 5.0) * 10) / 10,
          co: Math.round((current.carbon_monoxide ?? 200.0) * 10) / 10,
        },
        dt: Math.floor(Date.now() / 1000),
      },
    ],
  };
}
