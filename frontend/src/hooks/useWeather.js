import { useState, useEffect, useCallback } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { useThemeContext } from '../context/ThemeContext';
import { fetchApi } from '../utils/api';
import {
  fetchDirectOpenMeteoCurrent,
  fetchDirectOpenMeteoForecast,
  fetchDirectOpenMeteoPollution,
} from '../utils/openMeteoClient';

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
    let resolvedDistrict = activeCity?.district || '';
    let resolvedLocality = activeCity?.locality || '';
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
      // Step 1: If latitude and longitude are not directly available, resolve them via Geocoding
      if (targetLat == null || targetLon == null) {
        if (!locationName) {
          throw new Error('Location not found. Please try a different city, town, or country.');
        }

        let geoData = null;
        try {
          const geoParams = { query: locationName };
          if (apiKey) geoParams.apiKey = apiKey;
          const geoRes = await fetchApi('/api/weather/geocoding', geoParams);
          if (geoRes.ok) {
            geoData = await geoRes.json();
          }
        } catch (e) {
          console.warn('Backend geocoding failed, trying direct Open-Meteo search:', e);
        }

        if (!Array.isArray(geoData) || geoData.length === 0) {
          const omGeoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=5&language=en&format=json`);
          if (omGeoRes.ok) {
            const omGeoData = await omGeoRes.json();
            if (omGeoData?.results?.length > 0) {
              geoData = omGeoData.results.map(r => ({
                name: r.name,
                lat: r.latitude,
                lon: r.longitude,
                state: r.admin1 || '',
                country: r.country_code || '',
              }));
            }
          }
        }

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

      // Step 2: Fetch Current Weather (via Backend Proxy or Direct Open-Meteo)
      let weatherData = null;
      try {
        const weatherParams = { lat: targetLat, lon: targetLon };
        if (resolvedName && resolvedName !== 'Current Location') weatherParams.city = resolvedName;
        if (apiKey) weatherParams.apiKey = apiKey;

        const weatherRes = await fetchApi('/api/weather/current', weatherParams);
        if (weatherRes.ok) {
          weatherData = await weatherRes.json();
        }
      } catch (err) {
        console.warn('Backend weather fetch failed, using direct Open-Meteo meteorological client:', err);
      }

      if (!weatherData || !weatherData.main) {
        weatherData = await fetchDirectOpenMeteoCurrent(targetLat, targetLon, {
          name: resolvedName,
          state: resolvedState,
          country: resolvedCountry,
          district: resolvedDistrict,
          locality: resolvedLocality,
        });
      }

      if (resolvedState) weatherData.state = resolvedState;
      if (resolvedDistrict) weatherData.district = resolvedDistrict;
      if (resolvedLocality) weatherData.locality = resolvedLocality;
      if (resolvedCountry) {
        if (!weatherData.sys) weatherData.sys = {};
        weatherData.sys.country = resolvedCountry;
      }
      if (resolvedName && resolvedName !== 'Current Location') {
        weatherData.name = resolvedName;
      }

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
      let forecastData = null;
      try {
        const forecastParams = { lat: targetLat, lon: targetLon };
        if (resolvedName && resolvedName !== 'Current Location') forecastParams.city = resolvedName;
        if (apiKey) forecastParams.apiKey = apiKey;

        const forecastRes = await fetchApi('/api/weather/forecast', forecastParams);
        if (forecastRes.ok) {
          forecastData = await forecastRes.json();
        }
      } catch (err) {
        console.warn('Backend forecast fetch failed, using direct client:', err);
      }

      if (!forecastData || !forecastData.list) {
        forecastData = await fetchDirectOpenMeteoForecast(targetLat, targetLon);
      }
      setForecast(forecastData);

      // Step 4: Fetch Air Pollution Index
      let pollutionData = null;
      try {
        const pollutionParams = { lat: targetLat, lon: targetLon };
        if (resolvedName && resolvedName !== 'Current Location') pollutionParams.city = resolvedName;
        if (apiKey) pollutionParams.apiKey = apiKey;

        const pollutionRes = await fetchApi('/api/weather/pollution', pollutionParams);
        if (pollutionRes.ok) {
          pollutionData = await pollutionRes.json();
        }
      } catch (err) {
        console.warn('Backend pollution fetch failed, using direct client:', err);
      }

      if (!pollutionData || !pollutionData.list) {
        pollutionData = await fetchDirectOpenMeteoPollution(targetLat, targetLon);
      }
      setPollution(pollutionData);

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

    const performSearch = async () => {
      let results = [];
      try {
        const params = { query: trimmed };
        if (apiKey) params.apiKey = apiKey;

        const res = await fetchApi('/api/weather/geocoding', params);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) results = data;
        }
      } catch (err) {
        console.warn('Backend geocoding search failed, falling back to direct search:', err);
      }

      // If backend didn't return suggestions, query Open-Meteo Geocoding directly
      if (results.length === 0) {
        try {
          const omRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`);
          if (omRes.ok) {
            const omData = await omRes.json();
            if (Array.isArray(omData?.results)) {
              results = omData.results.map(item => ({
                name: item.name,
                lat: item.latitude,
                lon: item.longitude,
                state: item.admin1 || '',
                country: (item.country_code || '').toUpperCase(),
              }));
            }
          }
        } catch (omErr) {
          console.warn('Direct Open-Meteo geocoding failed:', omErr);
        }
      }

      if (isMounted) {
        setSuggestions(results);
        if (results.length === 0) {
          setGeoError('Location not found. Please try a different city, town, or country.');
        }
        setIsSearching(false);
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, apiKey]);

  return { suggestions, isSearching, geoError };
}

