import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'detecting' | 'granted' | 'denied' | 'error'
  const [locationToast, setLocationToast] = useState(null);
  const [showLocationPromptModal, setShowLocationPromptModal] = useState(false);
  const locationRequestRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'info', title = '') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setLocationToast({ message, type, title, id: Date.now() });
    if (type !== 'info' || !message.includes('Detecting')) {
      toastTimerRef.current = setTimeout(() => setLocationToast(null), 6000);
    }
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setLocationToast(null);
  };

  // Helper to reverse geocode lat & lon into precise locality, district, state, country, and postal code
  const reverseGeocodeCoords = async (latitude, longitude) => {
    let resolved = {
      name: '',
      locality: '',
      city: '',
      district: '',
      state: '',
      country: '',
      postalCode: '',
      lat: latitude,
      lon: longitude,
      isCurrentLocation: true,
    };

    // 1. Try Backend Reverse Geocoding
    try {
      const geoParams = { lat: latitude, lon: longitude };
      if (apiKey) geoParams.apiKey = apiKey;
      const revRes = await fetchApi('/api/weather/reverse-geocoding', geoParams);
      if (revRes.ok) {
        const revData = await revRes.json();
        if (Array.isArray(revData) && revData.length > 0) {
          const match = revData[0];
          resolved.name = match.name || match.locality || match.city || '';
          resolved.locality = match.locality || match.suburb || match.village || match.town || '';
          resolved.city = match.city || '';
          resolved.district = match.district || match.county || '';
          resolved.state = match.state || match.region || '';
          resolved.country = match.country || match.country_code || '';
          resolved.postalCode = match.postalCode || match.zip || match.postcode || '';
        }
      }
    } catch (e) {
      console.warn('Backend reverse geocoding unavailable, trying direct services...', e);
    }

    // 2. Direct BigDataCloud Reverse Geocoding (high accuracy locality + admin hierarchy)
    if (!resolved.name || resolved.name === 'Current Location') {
      try {
        const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const bdcRes = await fetch(bdcUrl);
        if (bdcRes.ok) {
          const bdcData = await bdcRes.json();
          const locality = bdcData.locality || bdcData.localityInfo?.administrative?.find(a => a.adminLevel === 4 || a.adminLevel === 5)?.name || '';
          const city = bdcData.city || bdcData.localityInfo?.administrative?.find(a => a.adminLevel === 3 || a.adminLevel === 2)?.name || '';
          const district = bdcData.localityInfo?.administrative?.find(a => a.description?.toLowerCase().includes('district') || a.adminLevel === 2)?.name || '';
          const state = bdcData.principalSubdivision || '';
          const country = bdcData.countryCode || '';
          const postcode = bdcData.postcode || bdcData.localityInfo?.postcode || '';

          resolved.locality = locality;
          resolved.city = city;
          resolved.district = district || (city && city !== locality ? city : '');
          resolved.state = state;
          resolved.country = country;
          resolved.postalCode = postcode;
          resolved.name = locality || city || district || state || 'Current Location';
        }
      } catch (e) {
        console.warn('Direct BigDataCloud reverse geocode error:', e);
      }
    }

    // 3. Direct Nominatim OpenStreetMap fallback if still missing details
    if (!resolved.name || resolved.name === 'Current Location' || !resolved.locality) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        const nomRes = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          const addr = nomData.address || {};
          const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.village || addr.town || addr.city_district || addr.hamlet || '';
          const city = addr.city || addr.town || addr.municipality || '';
          const district = addr.county || addr.district || addr.state_district || '';
          const state = addr.state || addr.region || '';
          const country = (addr.country_code || '').toUpperCase();
          const postcode = addr.postcode || '';

          resolved.locality = resolved.locality || locality;
          resolved.city = resolved.city || city;
          resolved.district = resolved.district || district;
          resolved.state = resolved.state || state;
          resolved.country = resolved.country || country;
          resolved.postalCode = resolved.postalCode || postcode;
          resolved.name = resolved.locality || resolved.city || locality || city || district || 'Current Location';
        }
      } catch (e) {
        console.warn('Nominatim reverse geocode error:', e);
      }
    }

    if (!resolved.name) {
      resolved.name = 'Current Location';
    }

    return resolved;
  };

  const getPosition = (options) => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

  // Try a fresh GPS fix first, then allow the browser to use a less restrictive source.
  const detectCurrentLocation = async (options = {}) => {
    if (locationRequestRef.current) return locationRequestRef.current;

    if (!navigator.geolocation) {
      showToast('Location is not supported by this browser.', 'error', 'Location unavailable');
      setLocationStatus('error');
      return false;
    }

    setLocationStatus('detecting');
    showToast('Detecting your location...', 'info', 'GPS Geolocation');

    const request = (async () => {
      let position;
      let isFallbackPosition = false;
      try {
        position = await getPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
      } catch (firstError) {
        if (firstError.code === 1) throw firstError;
        try {
          position = await getPosition({ enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 });
          isFallbackPosition = true;
        } catch (secondError) {
          throw secondError;
        }
      }

      try {
        const { latitude, longitude } = position.coords;
        const locationData = await reverseGeocodeCoords(latitude, longitude);
        locationData.locationSource = isFallbackPosition ? 'browser-fallback' : 'browser-gps';
        locationData.isFallbackLocation = isFallbackPosition;
        setActiveCity(locationData);
        setLocationStatus('granted');
        showToast(`Location detected: ${locationData.name}`, 'success', 'GPS Location Set');
        return true;
      } catch (err) {
        console.warn('Error processing GPS coordinates:', err);
        setLocationStatus('error');
        showToast('Your location was found, but the place name could not be resolved. Weather was not changed.', 'error', 'Location details unavailable');
        return false;
      }
    })().catch((error) => {
      let message = 'Your location could not be determined. Please try again.';
      let title = 'Location unavailable';
      if (error.code === 1) {
        message = 'Location permission is blocked. Enable location access in your browser settings.';
        title = 'Permission blocked';
        setLocationStatus('denied');
      } else if (error.code === 3) {
        message = 'Location detection took too long. Please try again.';
        title = 'Location timeout';
        setLocationStatus('error');
      } else {
        setLocationStatus('error');
      }
      showToast(message, 'error', title);
      console.warn('Browser GPS geolocation error:', error.message);
      return false;
    }).finally(() => {
      locationRequestRef.current = null;
    });

    locationRequestRef.current = request;
    return request;
  };

  useEffect(() => () => {
    if (locationRequestRef.current) locationRequestRef.current = null;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Check initial browser Geolocation permission status on application startup
  const checkStartupLocationPermission = async () => {
    // If user has explicitly dismissed or disabled auto GPS on launch, honor setting
    const hasSeenPrompt = localStorage.getItem('weatherhub_startup_prompt_dismissed') === 'true';

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

        if (permissionStatus.state === 'granted') {
          detectCurrentLocation();
        } else if (permissionStatus.state === 'prompt') {
          if (!hasSeenPrompt && useCurrentLocationOnLaunch) {
            setShowLocationPromptModal(true);
          }
        } else if (permissionStatus.state === 'denied') {
          setLocationStatus('denied');
          // Keep existing activeCity as fallback without repeatedly requesting
        }

        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            detectCurrentLocation();
          } else if (permissionStatus.state === 'denied') {
            setLocationStatus('denied');
          }
        };
        return;
      } catch (e) {
        console.warn('Browser does not support permissions.query for geolocation:', e);
      }
    }

    // Fallback if permissions.query API is unavailable
    if (useCurrentLocationOnLaunch && !hasSeenPrompt) {
      setShowLocationPromptModal(true);
    }
  };

  useEffect(() => {
    checkStartupLocationPermission();
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
        locationStatus,
        locationToast,
        showLocationPromptModal,
        setShowLocationPromptModal,
        showToast,
        dismissToast,
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
