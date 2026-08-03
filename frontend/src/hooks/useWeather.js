import { useState, useEffect, useCallback } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { useThemeContext } from '../context/ThemeContext';
import { fetchApi } from '../utils/api';

/**
 * Custom Hook: useWeather
 * Manages fetching current weather, forecast, and air pollution data.
 * Architecture Rule: Always resolves and fetches weather data using latitude & longitude coordinates.
 */
const apiCache = new Map();
const CACHE_TTL_MS = 300000; // 5 minutes

/**
 * Custom Hook: useWeather
 * Manages fetching current weather, forecast, and air pollution data with client caching.
 */
export function useWeather() {
  const { activeCity, apiKey } = useWeatherContext();
  const { updateCondition } = useThemeContext();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [pollution, setPollution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async (forceRefresh = false) => {
    if (!activeCity) return;

    const locationName = typeof activeCity === 'string' ? activeCity.trim() : activeCity.name;
    let targetLat = activeCity?.lat;
    let targetLon = activeCity?.lon;
    let resolvedState = activeCity?.state || '';
    let resolvedCountry = activeCity?.country || '';
    let resolvedName = locationName;

    const cacheKey = `${targetLat}_${targetLon}_${locationName}_${apiKey}`;
    const now = Date.now();

    if (!forceRefresh && apiCache.has(cacheKey)) {
      const cached = apiCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        setCurrentWeather(cached.currentWeather);
        setForecast(cached.forecast);
        setPollution(cached.pollution);
        setLoading(false);
        setError(null);
        if (cached.currentWeather?.weather?.[0]) {
          updateCondition(
            cached.currentWeather.weather[0].main,
            cached.currentWeather.weather[0].icon,
            cached.currentWeather.sys,
            cached.currentWeather.dt
          );
        }
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: If latitude and longitude are not directly available, resolve them via OpenWeather Geocoding API
      if (targetLat == null || targetLon == null) {
        if (!locationName) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        const geoParams = { query: locationName };
        if (apiKey) geoParams.apiKey = apiKey;

        const geoRes = await fetchApi('/api/weather/geocoding', geoParams);
        if (!geoRes.ok) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        const geoData = await geoRes.json();
        if (!Array.isArray(geoData) || geoData.length === 0) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        const primaryMatch = geoData[0];
        targetLat = primaryMatch.lat;
        targetLon = primaryMatch.lon;
        resolvedName = primaryMatch.name || resolvedName;
        resolvedState = primaryMatch.state || resolvedState;
        resolvedCountry = primaryMatch.country || resolvedCountry;
      }

      // Step 2: Fetch Current Weather
      const weatherParams = { lat: targetLat, lon: targetLon };
      if (resolvedName) weatherParams.city = resolvedName;
      if (apiKey) weatherParams.apiKey = apiKey;

      const weatherRes = await fetchApi('/api/weather/current', weatherParams);
      if (!weatherRes.ok) {
        throw new Error('Location not found. Please try a different city, town, or country.');
      }
      const weatherData = await weatherRes.json();

      if (resolvedState) weatherData.state = resolvedState;
      if (resolvedCountry) {
        if (!weatherData.sys) weatherData.sys = {};
        weatherData.sys.country = resolvedCountry;
      }
      if (resolvedName) weatherData.name = resolvedName;

      setCurrentWeather(weatherData);

      if (weatherData.weather?.[0]) {
        updateCondition(
          weatherData.weather[0].main,
          weatherData.weather[0].icon,
          weatherData.sys,
          weatherData.dt
        );
      }

      // Step 3: Fetch 5-Day / 3-Hour Forecast
      const forecastParams = { lat: targetLat, lon: targetLon };
      if (resolvedName) forecastParams.city = resolvedName;
      if (apiKey) forecastParams.apiKey = apiKey;

      let forecastData = null;
      const forecastRes = await fetchApi('/api/weather/forecast', forecastParams);
      if (forecastRes.ok) {
        forecastData = await forecastRes.json();
        setForecast(forecastData);
      }

      // Step 4: Fetch Air Pollution Index
      const pollutionParams = { lat: targetLat, lon: targetLon };
      if (resolvedName) pollutionParams.city = resolvedName;
      if (apiKey) pollutionParams.apiKey = apiKey;

      let pollutionData = null;
      const pollutionRes = await fetchApi('/api/weather/pollution', pollutionParams);
      if (pollutionRes.ok) {
        pollutionData = await pollutionRes.json();
        setPollution(pollutionData);
      }

      // Save to client cache
      apiCache.set(cacheKey, {
        timestamp: Date.now(),
        currentWeather: weatherData,
        forecast: forecastData,
        pollution: pollutionData,
      });

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
    refetch: () => fetchWeatherData(true),
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

    const params = { query: trimmed };
    if (apiKey) params.apiKey = apiKey;

    fetchApi('/api/weather/geocoding', params)
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

