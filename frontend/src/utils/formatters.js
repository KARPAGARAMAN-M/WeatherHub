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
  return `${val}°${unit}`;
}

export function formatTime(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '--:--';
  // OpenWeather timestamp is UTC seconds; timezoneOffset is seconds offset from UTC
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  return localDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export function formatDayName(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '';
  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const today = new Date();
  
  if (date.getUTCDate() === today.getUTCDate() && date.getUTCMonth() === today.getUTCMonth()) {
    return 'Today';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

export function formatHour(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '';
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
    // Convert m/s to mph
    const mph = Math.round(speedMps * 2.23694);
    return `${mph} mph`;
  }
  // km/h
  const kmh = Math.round(speedMps * 3.6);
  return `${kmh} km/h`;
}

export function getAqiInfo(aqi) {
  switch (aqi) {
    case 1:
      return { label: 'Good', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.2)', description: 'Air quality is considered satisfactory.' };
    case 2:
      return { label: 'Fair', color: '#8BC34A', bg: 'rgba(139, 195, 74, 0.2)', description: 'Air quality is acceptable.' };
    case 3:
      return { label: 'Moderate', color: '#FFC107', bg: 'rgba(255, 193, 7, 0.2)', description: 'Members of sensitive groups may experience health effects.' };
    case 4:
      return { label: 'Poor', color: '#FF9800', bg: 'rgba(255, 152, 0, 0.2)', description: 'Everyone may begin to experience health effects.' };
    case 5:
      return { label: 'Very Poor', color: '#F44336', bg: 'rgba(244, 67, 54, 0.2)', description: 'Health warnings of emergency conditions.' };
    default:
      return { label: 'Unknown', color: '#9E9E9E', bg: 'rgba(158, 158, 158, 0.2)', description: 'No air pollution data available.' };
  }
}
