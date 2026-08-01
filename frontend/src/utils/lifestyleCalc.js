/**
 * WeatherHub Lifestyle & Health Analytics Engine
 * Calculates Dew Point, Moon Phase, Clothing Suggestions, Umbrella Needs,
 * Driving Conditions, Outdoor Activity Ratings, Pollen Index, Health Advice, and Weather Alerts.
 */

/**
 * Calculates Dew Point in Celsius using the Magnus formula.
 * @param {number} tempC - Temperature in Celsius
 * @param {number} humidity - Relative humidity percentage (0-100)
 * @returns {number} Dew point in Celsius rounded to 1 decimal place
 */
export function calculateDewPoint(tempC, humidity) {
  if (tempC == null || humidity == null) return tempC || 0;
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

/**
 * Calculates current Moon Phase based on UTC date.
 * @param {Date} [date] - Date object
 * @returns {Object} Moon phase details (phaseName, iconEmoji, illumination, moonAgeDays)
 */
export function calculateMoonPhase(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  // Approximate Julian Day calculation
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  const daysSinceNew = jd - 2451549.5;
  const newMoons = daysSinceNew / 29.53058867;
  const phaseCycle = newMoons - Math.floor(newMoons);
  const moonAgeDays = Math.round(phaseCycle * 29.53 * 10) / 10;
  const illumination = Math.round((1 - Math.cos(phaseCycle * 2 * Math.PI)) / 2 * 100);

  let phaseName = 'New Moon';
  let iconEmoji = '🌑';

  if (phaseCycle < 0.03 || phaseCycle >= 0.97) {
    phaseName = 'New Moon';
    iconEmoji = '🌑';
  } else if (phaseCycle < 0.22) {
    phaseName = 'Waxing Crescent';
    iconEmoji = '🌒';
  } else if (phaseCycle < 0.28) {
    phaseName = 'First Quarter';
    iconEmoji = '🌓';
  } else if (phaseCycle < 0.47) {
    phaseName = 'Waxing Gibbous';
    iconEmoji = '🌔';
  } else if (phaseCycle < 0.53) {
    phaseName = 'Full Moon';
    iconEmoji = '🌕';
  } else if (phaseCycle < 0.72) {
    phaseName = 'Waning Gibbous';
    iconEmoji = '🌖';
  } else if (phaseCycle < 0.78) {
    phaseName = 'Third Quarter';
    iconEmoji = '🌗';
  } else {
    phaseName = 'Waning Crescent';
    iconEmoji = '🌘';
  }

  return {
    phaseName,
    iconEmoji,
    illumination,
    moonAgeDays,
  };
}

/**
 * Calculates clothing recommendation based on weather conditions.
 */
export function getClothingRecommendation(tempC, conditionMain, windSpeed) {
  if (tempC == null) return { outfit: 'Comfortable casual wear', tip: 'Check live temp before going out.' };

  const isRainy = ['Rain', 'Drizzle', 'Thunderstorm', 'Squall'].includes(conditionMain);
  const isSnowy = ['Snow'].includes(conditionMain);
  const isWindy = windSpeed > 8;

  let outfit = '';
  let tip = '';

  if (tempC < 0) {
    outfit = 'Heavy Winter Parka, Thermal Layers, Gloves & Beanie';
    tip = 'Extreme cold alert. Cover exposed skin to avoid frostbite.';
  } else if (tempC < 10) {
    outfit = 'Warm Coat, Sweater, Long Pants & Boots';
    tip = 'Chilly weather. Layer up for warmth.';
  } else if (tempC < 18) {
    outfit = 'Light Jacket, Hoodie or Cardigan with Jeans';
    tip = 'Brisk breeze. A removable mid-layer is recommended.';
  } else if (tempC < 26) {
    outfit = 'Cotton T-Shirt, Breathable Pants or Chinos';
    tip = 'Ideal comfortable temperature for casual outdoors.';
  } else if (tempC < 33) {
    outfit = 'Light Shorts, Tank Top, Sunglasses & Cap';
    tip = 'Warm & sunny. Wear breathable natural fabrics.';
  } else {
    outfit = 'Ultra-light Cotton/Linen Clothes, Hat & UV Protection';
    tip = 'Hot weather! Stay in shaded areas during peak midday sun.';
  }

  if (isRainy) {
    outfit += ' + Waterproof Raincoat';
  } else if (isSnowy) {
    outfit += ' + Insulated Snow Boots';
  }

  if (isWindy) {
    tip += ' Windbreaker recommended for breeze.';
  }

  return { outfit, tip };
}

/**
 * Calculates umbrella recommendation.
 */
export function getUmbrellaRecommendation(conditionMain, cloudsAll, pop = 0) {
  const isRain = ['Rain', 'Drizzle', 'Thunderstorm', 'Squall'].includes(conditionMain);
  const highPop = pop > 0.3;

  if (isRain || highPop) {
    return {
      status: 'Umbrella Required',
      color: '#EF4444',
      badge: '🌧 Rain Expected',
      detail: 'High chance of precipitation. Carry a compact sturdy umbrella.',
    };
  }

  if (cloudsAll > 70) {
    return {
      status: 'Keep Handy',
      color: '#F59E0B',
      badge: '☁ Overcast Sky',
      detail: 'Clouds are heavy. It might drizzle later in the day.',
    };
  }

  return {
    status: 'Not Needed',
    color: '#22C55E',
    badge: '☀ Clear Skies',
    detail: 'No rain expected today. Enjoy the clear weather!',
  };
}

/**
 * Calculates driving condition rating.
 */
export function getDrivingConditions(visibilityMeters, windSpeed, conditionMain) {
  const visKm = visibilityMeters ? visibilityMeters / 1000 : 10;
  const isSevere = ['Thunderstorm', 'Squall', 'Tornado'].includes(conditionMain);
  const isRain = ['Rain', 'Drizzle'].includes(conditionMain);
  const isFog = ['Fog', 'Mist', 'Haze', 'Dust', 'Sand'].includes(conditionMain);
  const isSnow = ['Snow'].includes(conditionMain);

  if (isSevere || windSpeed > 15 || visKm < 1.0) {
    return {
      rating: 'Hazardous Driving',
      color: '#EF4444',
      advice: 'Low visibility & high winds. Slow down and maintain extra safe braking distance.',
    };
  }

  if (isRain || isSnow || isFog || visKm < 5.0 || windSpeed > 10) {
    return {
      rating: 'Drive with Caution',
      color: '#F59E0B',
      advice: 'Wet or slick road surfaces. Turn on headlights and reduce travel speed.',
    };
  }

  return {
    rating: 'Excellent Conditions',
    color: '#22C55E',
    advice: 'Roads are clear and dry with high visual clarity. Safe driving expected.',
  };
}

/**
 * Outdoor Activity suitability scores (1 to 10 scale).
 */
export function getOutdoorActivities(tempC, humidity, windSpeed, conditionMain, uvi = 3) {
  const isBadWeather = ['Rain', 'Thunderstorm', 'Snow', 'Squall'].includes(conditionMain);

  let runningScore = 9;
  let cyclingScore = 9;
  let stargazingScore = 8;
  let beachScore = 8;

  if (isBadWeather) {
    runningScore = 2;
    cyclingScore = 1;
    stargazingScore = 1;
    beachScore = 1;
  } else {
    // Running score
    if (tempC < 5 || tempC > 30) runningScore -= 3;
    if (humidity > 80) runningScore -= 2;
    if (windSpeed > 10) runningScore -= 2;

    // Cycling score
    if (windSpeed > 12) cyclingScore -= 4;
    if (tempC > 32 || tempC < 8) cyclingScore -= 3;

    // Stargazing score
    if (['Clouds'].includes(conditionMain)) stargazingScore -= 5;

    // Beach score
    if (tempC < 24) beachScore -= 4;
    if (uvi < 2) beachScore -= 2;
  }

  const clamp = (val) => Math.max(1, Math.min(10, Math.round(val)));

  return [
    { name: 'Running / Jogging', score: clamp(runningScore), icon: '🏃' },
    { name: 'Cycling / Biking', score: clamp(cyclingScore), icon: '🚴' },
    { name: 'Beach / Swimming', score: clamp(beachScore), icon: '🏖' },
    { name: 'Stargazing / Night Sky', score: clamp(stargazingScore), icon: '🔭' },
  ];
}

/**
 * Pollen risk assessment.
 */
export function getPollenRisk(humidity, windSpeed, conditionMain) {
  if (['Rain', 'Thunderstorm', 'Snow'].includes(conditionMain)) {
    return { level: 'Low Pollen', color: '#22C55E', score: 2, detail: 'Rain washes pollen out of the air.' };
  }
  if (windSpeed > 8 && humidity < 45) {
    return { level: 'High Pollen Risk', color: '#EF4444', score: 8, detail: 'Dry breeze carries airborne grass & tree pollen.' };
  }
  if (humidity < 60) {
    return { level: 'Moderate Pollen', color: '#F59E0B', score: 5, detail: 'Moderate pollen levels. Allergy sufferers take precautions.' };
  }
  return { level: 'Low Pollen', color: '#22C55E', score: 3, detail: 'Moist air keeps pollen counts down.' };
}

/**
 * Health recommendations.
 */
export function getHealthRecommendations(tempC, humidity, uvi, aqiVal) {
  const tips = [];

  if (uvi >= 6) {
    tips.push({
      category: 'UV Sun Safety',
      text: 'High UV index. Apply SPF 30+ sunscreen and wear UV-filtering sunglasses.',
      color: '#F97316',
    });
  }

  if (tempC >= 32 || humidity > 75) {
    tips.push({
      category: 'Hydration Alert',
      text: 'High heat/humidity increases fluid loss. Drink at least 2.5L of water today.',
      color: '#38BDF8',
    });
  } else if (tempC < 10) {
    tips.push({
      category: 'Cold Protection',
      text: 'Keep hands and feet warm to maintain healthy circulation.',
      color: '#A855F7',
    });
  }

  if (aqiVal >= 4) {
    tips.push({
      category: 'Respiratory Warning',
      text: 'Poor Air Quality (AQI). Wear an N95 mask outdoors and use an indoor air purifier.',
      color: '#EF4444',
    });
  }

  if (tips.length === 0) {
    tips.push({
      category: 'Optimal Health',
      text: 'Weather parameters are in comfortable zones. Great day for outdoor movement!',
      color: '#22C55E',
    });
  }

  return tips;
}

/**
 * Severe Weather Alerts Generator based on current metrics.
 */
export function generateSevereAlerts(currentWeather) {
  if (!currentWeather) return [];

  const alerts = [];
  const temp = currentWeather?.main?.temp;
  const windSpd = currentWeather?.wind?.speed || 0;
  const mainCond = currentWeather?.weather?.[0]?.main || '';
  const descCond = (currentWeather?.weather?.[0]?.description || '').toLowerCase();
  const visibility = currentWeather?.visibility || 10000;

  if (mainCond === 'Thunderstorm' || descCond.includes('thunderstorm')) {
    alerts.push({
      id: 'alert-thunderstorm',
      title: 'Thunderstorm & Lightning Warning',
      severity: 'Severe',
      color: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.2)',
      description: 'Active thunderstorm cell in vicinity. Seek indoor shelter and stay away from open windows and tall metal structures.',
      time: 'Valid until conditions clear',
    });
  }

  if (mainCond === 'Rain' && (descCond.includes('heavy') || descCond.includes('extreme') || descCond.includes('torrential'))) {
    alerts.push({
      id: 'alert-heavy-rain',
      title: 'Heavy Rainfall & Waterlogging Alert',
      severity: 'Severe',
      color: '#F97316',
      badgeBg: 'rgba(249, 115, 22, 0.2)',
      description: 'Torrential downpour detected. Localized flooding possible in low-lying roadways. Avoid driving through standing water.',
      time: 'Immediate',
    });
  }

  if (temp >= 38) {
    alerts.push({
      id: 'alert-heat-wave',
      title: 'Extreme Heat Wave Warning',
      severity: 'Extreme',
      color: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.25)',
      description: 'Dangerously high temperature. Limit outdoor exposure between 11 AM and 4 PM to prevent heatstroke.',
      time: 'Peak Daytime Hours',
    });
  }

  if (windSpd >= 15) {
    alerts.push({
      id: 'alert-high-wind',
      title: 'Gale Wind Advisory',
      severity: 'Moderate',
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      description: `Strong gusts up to ${Math.round(windSpd * 3.6)} km/h. Secure loose outdoor items and beware of falling tree branches.`,
      time: 'Active Gust Period',
    });
  }

  if (visibility < 1500) {
    alerts.push({
      id: 'alert-fog',
      title: 'Dense Fog & Low Visibility Warning',
      severity: 'Moderate',
      color: '#FBBF24',
      badgeBg: 'rgba(251, 191, 36, 0.2)',
      description: 'Visibility dropped below 1.5 km. Drive slowly with low-beam fog lights switched on.',
      time: 'Morning / Night Hours',
    });
  }

  return alerts;
}
