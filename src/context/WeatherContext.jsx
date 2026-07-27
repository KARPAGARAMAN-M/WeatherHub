import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

const DEFAULT_SAVED_CITIES = [
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
];

export function WeatherProvider({ children }) {
  // Active city selection
  const [activeCity, setActiveCity] = useState(() => {
    const cached = localStorage.getItem('weatherhub_active_city');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return DEFAULT_SAVED_CITIES[0];
  });

  // Saved multi-city dashboard list
  const [savedCities, setSavedCities] = useState(() => {
    const cached = localStorage.getItem('weatherhub_saved_cities');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return DEFAULT_SAVED_CITIES;
  });

  // Temperature Unit (°C / °F)
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weatherhub_unit') || 'C';
  });

  // Custom API Key overrides env variable if provided
  const [apiKey, setApiKey] = useState(() => {
    const envKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const localKey = localStorage.getItem('weatherhub_api_key');
    return localKey || envKey || '';
  });

  // Modal open state for API key settings
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('weatherhub_active_city', JSON.stringify(activeCity));
  }, [activeCity]);

  useEffect(() => {
    localStorage.setItem('weatherhub_saved_cities', JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem('weatherhub_unit', unit);
  }, [unit]);

  const updateApiKey = (key) => {
    const cleanKey = key.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('weatherhub_api_key', cleanKey);
    } else {
      localStorage.removeItem('weatherhub_api_key');
    }
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  const isCitySaved = (cityName) => {
    if (!cityName) return false;
    return savedCities.some(c => c.name.toLowerCase() === cityName.toLowerCase());
  };

  const toggleSaveCity = (cityObj) => {
    if (!cityObj || !cityObj.name) return;
    setSavedCities(prev => {
      const exists = prev.some(c => c.name.toLowerCase() === cityObj.name.toLowerCase());
      if (exists) {
        return prev.filter(c => c.name.toLowerCase() !== cityObj.name.toLowerCase());
      } else {
        return [...prev, cityObj];
      }
    });
  };

  const removeSavedCity = (cityName) => {
    setSavedCities(prev => prev.filter(c => c.name.toLowerCase() !== cityName.toLowerCase()));
  };

  return (
    <WeatherContext.Provider
      value={{
        activeCity,
        setActiveCity,
        savedCities,
        setSavedCities,
        isCitySaved,
        toggleSaveCity,
        removeSavedCity,
        unit,
        toggleUnit,
        apiKey,
        updateApiKey,
        isKeyModalOpen,
        setIsKeyModalOpen,
        isDemoMode: !apiKey,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}
