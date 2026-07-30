/**
 * Formatting helpers for temperature, dates, wind, and air quality
 */

export function convertTemp(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius, unit = 'C') {
  const val = convertTemp(celsius, unit);
  return `${val}°`;
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
 * Returns a human-friendly timezone code label (e.g. IST (UTC+5:30), GMT, EST)
 */
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

export function formatHour(unixTimestamp, timezoneOffsetSeconds = 0, isFirst = false) {
  if (!unixTimestamp) return '';
  if (isFirst === true) return 'Now';
  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' });
}

export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export function formatWind(speedMps, unit = 'C') {
  if (speedMps === undefined || speedMps === null) return '--';
  if (unit === 'F') {
    const mph = Math.round(speedMps * 2.23694);
    return `${mph} mph`;
  }
  const kmh = Math.round(speedMps * 3.6);
  return `${kmh} km/h`;
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

/**
 * Converts ISO 3166-1 alpha-2 country codes (e.g., 'IN', 'US') to full country names ('India', 'United States')
 */
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
 * Formats full location string with City, State, and Country (e.g. "Salem, Tamil Nadu, India")
 */
export function formatLocationTitle({ name, state, country }) {
  const parts = [];
  if (name) parts.push(name);
  if (state && state.trim().toLowerCase() !== name?.trim().toLowerCase()) {
    parts.push(state.trim());
  }
  if (country) {
    const fullCountry = getCountryName(country.trim());
    parts.push(fullCountry);
  }
  return parts.join(', ');
}

