import { useState, useEffect, useCallback } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { useThemeContext } from '../context/ThemeContext';

/**
 * Custom Hook: useWeather
 * Manages fetching current weather, forecast, and air pollution data.
 * Architecture Rule: Always resolves and fetches weather data using latitude & longitude coordinates.
 */
export function useWeather() {
  const { activeCity, apiKey } = useWeatherContext();
  const { updateCondition } = useThemeContext();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [pollution, setPollution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    if (!activeCity) return;

    setLoading(true);
    setError(null);

    const locationName = typeof activeCity === 'string' ? activeCity.trim() : activeCity.name;
    let targetLat = activeCity?.lat;
    let targetLon = activeCity?.lon;
    let resolvedState = activeCity?.state || '';
    let resolvedCountry = activeCity?.country || '';
    let resolvedName = locationName;

    try {
      // Step 1: If latitude and longitude are not directly available, resolve them via OpenWeather Geocoding API
      if (targetLat == null || targetLon == null) {
        if (!locationName) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        const geoParams = new URLSearchParams({ query: locationName });
        if (apiKey) geoParams.append('apiKey', apiKey);

        const geoRes = await fetch(`/api/weather/geocoding?${geoParams.toString()}`);
        if (!geoRes.ok) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        const geoData = await geoRes.json();
        if (!Array.isArray(geoData) || geoData.length === 0) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        // Use the first matching location result
        const primaryMatch = geoData[0];
        targetLat = primaryMatch.lat;
        targetLon = primaryMatch.lon;
        resolvedName = primaryMatch.name || resolvedName;
        resolvedState = primaryMatch.state || resolvedState;
        resolvedCountry = primaryMatch.country || resolvedCountry;
      }

      // Step 2: Fetch Current Weather strictly using Latitude and Longitude
      const weatherParams = new URLSearchParams({
        lat: targetLat,
        lon: targetLon,
      });
      if (resolvedName) weatherParams.append('city', resolvedName);
      if (apiKey) weatherParams.append('apiKey', apiKey);

      const weatherRes = await fetch(`/api/weather/current?${weatherParams.toString()}`);
      if (!weatherRes.ok) {
        throw new Error('Location not found. Please try a different city, town, or country.');
      }
      const weatherData = await weatherRes.json();

      // Attach resolved place metadata (state, country, display name)
      if (resolvedState) weatherData.state = resolvedState;
      if (resolvedCountry) {
        if (!weatherData.sys) weatherData.sys = {};
        weatherData.sys.country = resolvedCountry;
      }
      if (resolvedName) weatherData.name = resolvedName;

      setCurrentWeather(weatherData);

      // Trigger dynamic UI theme transition based on condition and daylight
      if (weatherData.weather?.[0]) {
        updateCondition(
          weatherData.weather[0].main,
          weatherData.weather[0].icon,
          weatherData.sys,
          weatherData.dt
        );
      }

      // Step 3: Fetch 5-Day / 3-Hour Forecast using Latitude and Longitude
      const forecastParams = new URLSearchParams({
        lat: targetLat,
        lon: targetLon,
      });
      if (resolvedName) forecastParams.append('city', resolvedName);
      if (apiKey) forecastParams.append('apiKey', apiKey);

      const forecastRes = await fetch(`/api/weather/forecast?${forecastParams.toString()}`);
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData);
      }

      // Step 4: Fetch Air Pollution Index using Latitude and Longitude
      const pollutionParams = new URLSearchParams({
        lat: targetLat,
        lon: targetLon,
      });
      if (resolvedName) pollutionParams.append('city', resolvedName);
      if (apiKey) pollutionParams.append('apiKey', apiKey);

      const pollutionRes = await fetch(`/api/weather/pollution?${pollutionParams.toString()}`);
      if (pollutionRes.ok) {
        const pollutionData = await pollutionRes.json();
        setPollution(pollutionData);
      }

    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(
        err.message || 'Location not found. Please try a different city, town, or country.'
      );
      setCurrentWeather(null);
    } finally {
      setLoading(false);
    }
  }, [activeCity, apiKey, updateCondition]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    currentWeather,
    forecast,
    pollution,
    loading,
    error,
    refetch: fetchWeatherData,
  };
}

/**
 * Custom Hook: useGeocoding
 * Performs debounced search for location autocomplete suggestions (cities, towns, villages, states, countries).
 */
export function useGeocoding(searchQuery) {
  const { apiKey } = useWeatherContext();
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    const trimmed = searchQuery ? searchQuery.trim() : '';
    if (!trimmed || trimmed.length < 1) {
      setSuggestions([]);
      setIsSearching(false);
      setGeoError(null);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    setGeoError(null);

    const params = new URLSearchParams({ query: trimmed });
    if (apiKey) params.append('apiKey', apiKey);

    fetch(`/api/weather/geocoding?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          const results = Array.isArray(data) ? data : [];
          setSuggestions(results);
          if (results.length === 0) {
            setGeoError('Location not found. Please try a different city, town, or country.');
          }
        }
      })
      .catch((err) => {
        console.error('Geocoding fetch failed:', err);
        if (isMounted) {
          setSuggestions([]);
          setGeoError('Location not found. Please try a different city, town, or country.');
        }
      })
      .finally(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, apiKey]);

  return { suggestions, isSearching, geoError };
}
