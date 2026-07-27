import { useState, useEffect, useCallback } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { useThemeContext } from '../context/ThemeContext';
import { MOCK_WEATHER_DATABASE } from '../utils/mockData';

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

    const cityName = typeof activeCity === 'string' ? activeCity : activeCity.name;

    try {
      let queryParams = new URLSearchParams();
      if (activeCity.lat && activeCity.lon) {
        queryParams.append('lat', activeCity.lat);
        queryParams.append('lon', activeCity.lon);
      } else {
        queryParams.append('city', cityName);
      }
      if (apiKey) {
        queryParams.append('apiKey', apiKey);
      }

      // 1. Current Weather from Spring Boot backend
      const weatherRes = await fetch(`/api/weather/current?${queryParams.toString()}`);
      if (!weatherRes.ok) {
        throw new Error(`Spring Boot Backend Error (${weatherRes.status})`);
      }
      const weatherData = await weatherRes.json();
      setCurrentWeather(weatherData);

      if (weatherData.weather?.[0]?.main) {
        updateCondition(weatherData.weather[0].main);
      }

      // 2. Forecast from Spring Boot backend
      const forecastParams = new URLSearchParams();
      if (weatherData.coord?.lat && weatherData.coord?.lon) {
        forecastParams.append('lat', weatherData.coord.lat);
        forecastParams.append('lon', weatherData.coord.lon);
      } else {
        forecastParams.append('city', cityName);
      }
      if (apiKey) forecastParams.append('apiKey', apiKey);

      const forecastRes = await fetch(`/api/weather/forecast?${forecastParams.toString()}`);
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData);
      }

      // 3. Air Pollution from Spring Boot backend
      const pollutionParams = new URLSearchParams();
      if (weatherData.coord?.lat && weatherData.coord?.lon) {
        pollutionParams.append('lat', weatherData.coord.lat);
        pollutionParams.append('lon', weatherData.coord.lon);
      }
      if (apiKey) pollutionParams.append('apiKey', apiKey);

      const pollutionRes = await fetch(`/api/weather/pollution?${pollutionParams.toString()}`);
      if (pollutionRes.ok) {
        const pollutionData = await pollutionRes.json();
        setPollution(pollutionData);
      }

    } catch (err) {
      console.warn('Backend fetch error, attempting mock fallback:', err);
      const fallback = MOCK_WEATHER_DATABASE[cityName] || MOCK_WEATHER_DATABASE['London'];
      setCurrentWeather(fallback.current);
      setForecast(fallback.forecast);
      setPollution(fallback.pollution);
      if (fallback.current?.weather?.[0]?.main) {
        updateCondition(fallback.current.weather[0].main);
      }
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

export function useGeocoding(searchQuery) {
  const { apiKey } = useWeatherContext();
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const params = new URLSearchParams({ query: searchQuery.trim() });
    if (apiKey) params.append('apiKey', apiKey);

    fetch(`/api/weather/geocoding?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setSuggestions(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error('Geocoding fetch failed:', err);
        if (isMounted) setSuggestions([]);
      })
      .finally(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, apiKey]);

  return { suggestions, isSearching };
}
