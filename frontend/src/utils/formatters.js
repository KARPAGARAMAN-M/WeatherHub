/**
 * Meteorological Formatting & Precision Analytics Engine
 * Provides exact weather condition labels, rainfall/snowfall intensity thresholds,
 * photography hours (Golden Hour & Blue Hour), wind gust analysis, and hierarchical location formatting.
 */

export function convertTemp(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius * 10) / 10;
}

export function formatTemp(celsius, unit = 'C') {
  const val = convertTemp(celsius, unit);
  if (val === '--') return '--';
  return `${val}°${unit}`;
}

export function formatTime(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '--:--';
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  return localDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

/**
 * Formats timestamp specifically into Indian Standard Time (IST - Asia/Kolkata)
 */
export function formatTimeIST(unixTimestamp) {
  if (!unixTimestamp) return '--:--';
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

/**
 * Calculates Golden Hour and Blue Hour windows for photography based on Sunrise and Sunset timestamps.
 */
export function calculatePhotographyHours(sunriseEpoch, sunsetEpoch, timezoneOffsetSeconds = 0) {
  if (!sunriseEpoch || !sunsetEpoch) {
    return {
      morningGoldenHour: '--:--',
      eveningGoldenHour: '--:--',
      morningBlueHour: '--:--',
      eveningBlueHour: '--:--',
      currentPhotoPhase: 'Daylight',
    };
  }

  // Morning Golden Hour: Sunrise to Sunrise + 60 mins
  const morningGoldenStart = sunriseEpoch;
  const morningGoldenEnd = sunriseEpoch + 3600;

  // Evening Golden Hour: Sunset - 60 mins to Sunset
  const eveningGoldenStart = sunsetEpoch - 3600;
  const eveningGoldenEnd = sunsetEpoch;

  // Morning Blue Hour: Sunrise - 30 mins to Sunrise - 10 mins
  const morningBlueStart = sunriseEpoch - 1800;
  const morningBlueEnd = sunriseEpoch - 600;

  // Evening Blue Hour: Sunset + 10 mins to Sunset + 30 mins
  const eveningBlueStart = sunsetEpoch + 600;
  const eveningBlueEnd = sunsetEpoch + 1800;

  const nowSec = Math.floor(Date.now() / 1000);

  let currentPhotoPhase = 'Daylight';
  if (nowSec >= morningBlueStart && nowSec <= morningBlueEnd) {
    currentPhotoPhase = 'Morning Blue Hour 📷';
  } else if (nowSec >= morningGoldenStart && nowSec <= morningGoldenEnd) {
    currentPhotoPhase = 'Morning Golden Hour 🌅';
  } else if (nowSec >= eveningGoldenStart && nowSec <= eveningGoldenEnd) {
    currentPhotoPhase = 'Evening Golden Hour 🌇';
  } else if (nowSec >= eveningBlueStart && nowSec <= eveningBlueEnd) {
    currentPhotoPhase = 'Evening Blue Hour 🌆';
  } else if (nowSec < sunriseEpoch || nowSec > sunsetEpoch) {
    currentPhotoPhase = 'Night Sky 🌌';
  }

  return {
    morningGoldenHour: `${formatTime(morningGoldenStart, timezoneOffsetSeconds)} – ${formatTime(morningGoldenEnd, timezoneOffsetSeconds)}`,
    eveningGoldenHour: `${formatTime(eveningGoldenStart, timezoneOffsetSeconds)} – ${formatTime(eveningGoldenEnd, timezoneOffsetSeconds)}`,
    morningBlueHour: `${formatTime(morningBlueStart, timezoneOffsetSeconds)} – ${formatTime(morningBlueEnd, timezoneOffsetSeconds)}`,
    eveningBlueHour: `${formatTime(eveningBlueStart, timezoneOffsetSeconds)} – ${formatTime(eveningBlueEnd, timezoneOffsetSeconds)}`,
    currentPhotoPhase,
  };
}

/**
 * Calculates exact rainfall intensity in mm/hr from 1h / 3h API data and classifies precipitation level.
 */
export function calculateRainIntensity(rainObj, conditionDesc = '') {
  let mmPerHour = 0;
  if (rainObj) {
    if (typeof rainObj === 'number') {
      mmPerHour = rainObj;
    } else if (rainObj['1h'] != null) {
      mmPerHour = rainObj['1h'];
    } else if (rainObj['3h'] != null) {
      mmPerHour = rainObj['3h'] / 3.0;
    }
  }

  const descLower = (conditionDesc || '').toLowerCase();
  if (mmPerHour === 0 && descLower.includes('drizzle')) {
    mmPerHour = 0.15;
  } else if (mmPerHour === 0 && descLower.includes('light rain')) {
    mmPerHour = 1.2;
  } else if (mmPerHour === 0 && descLower.includes('moderate rain')) {
    mmPerHour = 4.5;
  } else if (mmPerHour === 0 && descLower.includes('heavy rain')) {
    mmPerHour = 15.0;
  }

  let label = 'No Rain';
  let badgeColor = '#22C55E';

  if (mmPerHour > 50.0) {
    label = 'Extreme Downpour';
    badgeColor = '#EF4444';
  } else if (mmPerHour >= 7.5) {
    label = 'Heavy Rain';
    badgeColor = '#F97316';
  } else if (mmPerHour >= 2.5) {
    label = 'Moderate Rain';
    badgeColor = '#F59E0B';
  } else if (mmPerHour >= 0.25) {
    label = 'Light Rain';
    badgeColor = '#38BDF8';
  } else if (mmPerHour > 0) {
    label = 'Light Drizzle';
    badgeColor = '#0EA5E9';
  }

  return {
    mmPerHour: Math.round(mmPerHour * 100) / 100,
    label,
    badgeColor,
    formatted: `${(Math.round(mmPerHour * 100) / 100).toFixed(2)} mm/h`,
  };
}

/**
 * Calculates exact snowfall intensity in mm/hr from 1h / 3h API data.
 */
export function calculateSnowIntensity(snowObj, conditionDesc = '') {
  let mmPerHour = 0;
  if (snowObj) {
    if (typeof snowObj === 'number') {
      mmPerHour = snowObj;
    } else if (snowObj['1h'] != null) {
      mmPerHour = snowObj['1h'];
    } else if (snowObj['3h'] != null) {
      mmPerHour = snowObj['3h'] / 3.0;
    }
  }

  const descLower = (conditionDesc || '').toLowerCase();
  if (mmPerHour === 0 && descLower.includes('light snow')) {
    mmPerHour = 0.3;
  } else if (mmPerHour === 0 && descLower.includes('heavy snow')) {
    mmPerHour = 3.5;
  } else if (mmPerHour === 0 && descLower.includes('snow')) {
    mmPerHour = 1.0;
  }

  let label = 'No Snowfall';
  let badgeColor = '#94A3B8';

  if (mmPerHour >= 2.5) {
    label = 'Heavy Snowfall';
    badgeColor = '#A855F7';
  } else if (mmPerHour >= 0.5) {
    label = 'Moderate Snowfall';
    badgeColor = '#38BDF8';
  } else if (mmPerHour > 0) {
    label = 'Light Snow Flurries';
    badgeColor = '#7DD3FC';
  }

  return {
    mmPerHour: Math.round(mmPerHour * 100) / 100,
    label,
    badgeColor,
    formatted: `${(Math.round(mmPerHour * 100) / 100).toFixed(2)} mm/h`,
  };
}

/**
 * Extracts and capitalizes the exact meteorological description from the API response.
 * Strictly avoids oversimplifying or replacing exact terms with generic "Raining" or "Cloudy".
 */
export function formatExactWeatherDescription(weatherObj) {
  if (!weatherObj) return 'Clear Sky';
  const rawDesc = weatherObj.description || weatherObj.main || 'Clear Sky';
  
  // Title-case capitalization for every word
  return rawDesc
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getTimezoneLabel(timezoneOffsetSeconds = 19800, countryCode = '') {
  if (countryCode?.toUpperCase() === 'IN' || timezoneOffsetSeconds === 19800) {
    return 'IST (UTC+5:30)';
  }
  if (timezoneOffsetSeconds === 0) return 'GMT (UTC+0)';
  if (timezoneOffsetSeconds === 3600) return 'CET (UTC+1)';
  if (timezoneOffsetSeconds === 7200) return 'EET (UTC+2)';
  if (timezoneOffsetSeconds === 10800) return 'MSK (UTC+3)';
  if (timezoneOffsetSeconds === 14400) return 'GST (UTC+4)';
  if (timezoneOffsetSeconds === 25200) return 'ICT (UTC+7)';
  if (timezoneOffsetSeconds === 28800) return 'SGT (UTC+8)';
  if (timezoneOffsetSeconds === 32400) return 'JST (UTC+9)';
  if (timezoneOffsetSeconds === 36000) return 'AEST (UTC+10)';
  if (timezoneOffsetSeconds === 43200) return 'NZST (UTC+12)';
  if (timezoneOffsetSeconds === -18000) return 'EST (UTC-5)';
  if (timezoneOffsetSeconds === -21600) return 'CST (UTC-6)';
  if (timezoneOffsetSeconds === -28800) return 'PST (UTC-8)';
  if (timezoneOffsetSeconds === -10800) return 'BRT (UTC-3)';

  const totalMinutes = Math.abs(Math.round(timezoneOffsetSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const sign = timezoneOffsetSeconds >= 0 ? '+' : '-';
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `UTC${sign}${formattedHours}:${formattedMinutes}`;
}

export function formatDate(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '';
  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDayName(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '';

  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const now = new Date((Math.floor(Date.now() / 1000) + timezoneOffsetSeconds) * 1000);

  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  const isToday =
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate();

  if (isToday) return `Today, ${dateStr}`;

  const tomorrow = new Date(now.getTime() + 86400000);
  const isTomorrow =
    date.getUTCFullYear() === tomorrow.getUTCFullYear() &&
    date.getUTCMonth() === tomorrow.getUTCMonth() &&
    date.getUTCDate() === tomorrow.getUTCDate();

  if (isTomorrow) return `Tomorrow, ${dateStr}`;

  const weekdayStr = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  return `${weekdayStr}, ${dateStr}`;
}

export function formatHour(unixTimestamp, timezoneOffsetSeconds = 0, isCurrentHour = false) {
  if (!unixTimestamp) return '';
  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });

  if (isCurrentHour) {
    return `Now (${formattedTime})`;
  }
  return formattedTime;
}

export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function formatWind(speedMps, unit = 'C', gustMps = null) {
  if (speedMps === undefined || speedMps === null) return '--';

  let spdText = '';
  let gustText = '';

  if (unit === 'F') {
    const mph = Math.round(speedMps * 2.23694);
    spdText = `${mph} mph`;
    if (gustMps && gustMps > speedMps) {
      gustText = ` (Gusts: ${Math.round(gustMps * 2.23694)} mph)`;
    }
  } else {
    const kmh = Math.round(speedMps * 3.6);
    spdText = `${kmh} km/h`;
    if (gustMps && gustMps > speedMps) {
      gustText = ` (Gusts: ${Math.round(gustMps * 3.6)} km/h)`;
    }
  }

  return `${spdText}${gustText}`;
}

export function getAqiInfo(aqi) {
  switch (aqi) {
    case 1:
      return { label: 'Good', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', description: 'Air quality is considered satisfactory.' };
    case 2:
      return { label: 'Fair', color: '#84CC16', bg: 'rgba(132, 204, 22, 0.15)', description: 'Air quality is acceptable.' };
    case 3:
      return { label: 'Moderate', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', description: 'Sensitive groups may experience health effects.' };
    case 4:
      return { label: 'Poor', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)', description: 'Everyone may begin to experience health effects.' };
    case 5:
      return { label: 'Very Poor', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', description: 'Health warnings of emergency conditions.' };
    default:
      return { label: 'Unknown', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)', description: 'No air quality data available.' };
  }
}

export function getCountryName(countryCode) {
  if (!countryCode) return '';
  if (countryCode.length > 2) return countryCode;
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(countryCode.toUpperCase()) || countryCode;
  } catch (e) {
    return countryCode;
  }
}

/**
 * Formats full location string with hierarchical precision:
 * Street / Area -> Village / Town / City -> District / County -> State -> Country
 * Example: "Westminster, Greater London, England, United Kingdom"
 */
export function formatLocationTitle({ name, village, town, district, state, country }) {
  const parts = [];

  const firstLevel = village || town || name;
  if (firstLevel) parts.push(firstLevel);

  if (district && district.trim().toLowerCase() !== firstLevel?.trim().toLowerCase()) {
    parts.push(district.trim());
  }

  if (state && state.trim().toLowerCase() !== firstLevel?.trim().toLowerCase() && state.trim().toLowerCase() !== district?.trim().toLowerCase()) {
    parts.push(state.trim());
  }

  if (country) {
    const fullCountry = getCountryName(country.trim());
    parts.push(fullCountry);
  }

  return parts.join(', ');
}

/**
 * Formats latitude and longitude coordinates into N/S and E/W format.
 */
export function formatCoordinates(lat, lon) {
  if (lat == null || lon == null) return '--';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}
