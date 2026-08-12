import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

const WeatherContext = createContext();

const DEFAULT_SAVED_CITIES = [
  { name: 'Chennai', state: 'Tamil Nadu', country: 'IN', lat: 13.0827, lon: 80.2707 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', state: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'IN', lat: 12.9716, lon: 77.5946 },
  { name: 'London', state: 'England', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', state: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', state: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', state: 'Île-de-France', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', state: 'New South Wales', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', state: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', state: '', country: 'SG', lat: 1.3521, lon: 103.8198 },
  { name: 'Toronto', state: 'Ontario', country: 'CA', lat: 43.6532, lon: -79.3832 },
];

export function WeatherProvider({ children }) {
  const [useCurrentLocationOnLaunch, setUseCurrentLocationOnLaunch] = useState(() => {
    const cached = localStorage.getItem('weatherhub_use_current_location_on_launch');
    return cached === null ? true : cached === 'true';
  });

  const [activeCity, setActiveCity] = useState(() => {
    const cached = localStorage.getItem('weatherhub_active_city');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return DEFAULT_SAVED_CITIES[0]; // Chennai fallback
  });

  const [savedCities, setSavedCities] = useState(() => {
    const cached = localStorage.getItem('weatherhub_saved_cities');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return DEFAULT_SAVED_CITIES;
  });

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weatherhub_unit') || 'C';
  });

  const [apiKey, setApiKey] = useState(() => {
    const envKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const localKey = localStorage.getItem('weatherhub_api_key');
    return localKey || envKey || '';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync settings & activeCity to localStorage
  useEffect(() => {
    localStorage.setItem('weatherhub_use_current_location_on_launch', String(useCurrentLocationOnLaunch));
  }, [useCurrentLocationOnLaunch]);

  useEffect(() => {
    if (activeCity) {
      localStorage.setItem('weatherhub_active_city', JSON.stringify(activeCity));
    }
  }, [activeCity]);

  useEffect(() => {
    localStorage.setItem('weatherhub_saved_cities', JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem('weatherhub_unit', unit);
  }, [unit]);

  // Function to detect current user location via Geolocation API
  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) return false;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geoParams = { lat: latitude, lon: longitude };
            if (apiKey) geoParams.apiKey = apiKey;

            let cityName = 'Current Location';
            let stateName = '';
            let countryCode = '';

            const revRes = await fetchApi('/api/weather/reverse-geocoding', geoParams);
            if (revRes.ok) {
              const revData = await revRes.json();
              if (Array.isArray(revData) && revData.length > 0) {
                const match = revData[0];
                cityName = match.name || cityName;
                stateName = match.state || '';
                countryCode = match.country || '';
              }
            }

            setActiveCity({
              name: cityName,
              state: stateName,
              country: countryCode,
              lat: latitude,
              lon: longitude,
              isCurrentLocation: true,
            });
            resolve(true);
          } catch (e) {
            setActiveCity({
              name: 'Current Location',
              lat: latitude,
              lon: longitude,
              isCurrentLocation: true,
            });
            resolve(true);
          }
        },
        (error) => {
          console.warn('Geolocation default position request error/denied:', error);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  // Auto-detect user's current location whenever app is opened newly if setting enabled
  useEffect(() => {
    if (useCurrentLocationOnLaunch && navigator.geolocation) {
      detectCurrentLocation();
    }
  }, []); // Run on initial launch / app mount

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

  // Check if a city is saved based on lat/lon or location details
  const isCitySaved = (target) => {
    if (!target) return false;
    const nameStr = typeof target === 'string' ? target : target.name;
    const latNum = target?.lat;
    const lonNum = target?.lon;

    return savedCities.some(c => {
      if (latNum != null && lonNum != null && c.lat != null && c.lon != null) {
        return Math.abs(c.lat - latNum) < 0.05 && Math.abs(c.lon - lonNum) < 0.05;
      }
      return c.name.toLowerCase() === nameStr?.toLowerCase();
    });
  };

  const toggleSaveCity = (cityObj) => {
    if (!cityObj || !cityObj.name) return;
    setSavedCities(prev => {
      const exists = isCitySaved(cityObj);
      if (exists) {
        return prev.filter(c => {
          if (cityObj.lat != null && cityObj.lon != null && c.lat != null && c.lon != null) {
            return !(Math.abs(c.lat - cityObj.lat) < 0.05 && Math.abs(c.lon - cityObj.lon) < 0.05);
          }
          return c.name.toLowerCase() !== cityObj.name.toLowerCase();
        });
      } else {
        return [...prev, cityObj];
      }
    });
  };

  const removeSavedCity = (target) => {
    const nameStr = typeof target === 'string' ? target : target?.name;
    const latNum = target?.lat;
    const lonNum = target?.lon;

    setSavedCities(prev => prev.filter(c => {
      if (latNum != null && lonNum != null && c.lat != null && c.lon != null) {
        return !(Math.abs(c.lat - latNum) < 0.05 && Math.abs(c.lon - lonNum) < 0.05);
      }
      return c.name.toLowerCase() !== nameStr?.toLowerCase();
    }));
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
        isSettingsOpen,
        setIsSettingsOpen,
        useCurrentLocationOnLaunch,
        setUseCurrentLocationOnLaunch,
        detectCurrentLocation,
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
