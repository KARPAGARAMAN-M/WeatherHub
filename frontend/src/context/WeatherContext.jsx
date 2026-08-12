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

  // Helper to reverse geocode lat & lon into precise city, neighborhood/locality, district, state, and country
  const reverseGeocodeCoords = async (latitude, longitude) => {
    let resolved = {
      name: '',
      locality: '',
      district: '',
      state: '',
      country: '',
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
          resolved.name = match.name || '';
          resolved.locality = match.locality || '';
          resolved.district = match.district || '';
          resolved.state = match.state || '';
          resolved.country = match.country || '';
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
          const locality = bdcData.locality || bdcData.localityInfo?.administrative?.find(a => a.adminLevel === 4)?.name || '';
          const city = bdcData.city || bdcData.localityInfo?.administrative?.find(a => a.adminLevel === 3 || a.adminLevel === 2)?.name || '';
          const district = bdcData.localityInfo?.administrative?.find(a => a.description?.includes('district') || a.adminLevel === 2)?.name || '';
          const state = bdcData.principalSubdivision || '';
          const country = bdcData.countryCode || '';

          resolved.name = locality || city || state || 'Current Location';
          resolved.locality = locality;
          resolved.district = district || (city !== locality ? city : '');
          resolved.state = state;
          resolved.country = country;
        }
      } catch (e) {
        console.warn('Direct BigDataCloud reverse geocode error:', e);
      }
    }

    // 3. Direct Nominatim OpenStreetMap fallback if still needed
    if (!resolved.name || resolved.name === 'Current Location') {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        const nomRes = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          const addr = nomData.address || {};
          const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.village || addr.town || addr.city_district || '';
          const city = addr.city || addr.town || addr.municipality || '';
          const district = addr.county || addr.district || '';
          const state = addr.state || '';
          const country = (addr.country_code || '').toUpperCase();

          resolved.name = locality || city || district || 'Current Location';
          resolved.locality = locality;
          resolved.district = district || (city !== locality ? city : '');
          resolved.state = state;
          resolved.country = country;
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

  // Helper to detect approximate location by IP when browser GPS is blocked/unavailable
  const detectLocationByIp = async () => {
    try {
      const ipRes = await fetch('https://ipapi.co/json/');
      if (ipRes.ok) {
        const data = await ipRes.json();
        if (data.latitude && data.longitude) {
          return {
            name: data.city || data.region || 'Current Location',
            district: data.city || '',
            state: data.region || '',
            country: data.country_code || '',
            lat: data.latitude,
            lon: data.longitude,
            isCurrentLocation: true,
          };
        }
      }
    } catch (e) {
      console.warn('ipapi.co failed, trying ipwho.is:', e);
    }

    try {
      const ipWhoRes = await fetch('https://ipwho.is/');
      if (ipWhoRes.ok) {
        const data = await ipWhoRes.json();
        if (data.success && data.latitude && data.longitude) {
          return {
            name: data.city || data.region || 'Current Location',
            district: data.city || '',
            state: data.region || '',
            country: data.country_code || '',
            lat: data.latitude,
            lon: data.longitude,
            isCurrentLocation: true,
          };
        }
      }
    } catch (e) {
      console.warn('ipwho.is fallback failed:', e);
    }

    return null;
  };

  // Function to detect exact current user location via Geolocation API + IP fallback
  const detectCurrentLocation = async () => {
    let detectedLocation = null;

    // Attempt 1: Browser GPS / Hardware Geolocation with maximum accuracy and no cache
    if (navigator.geolocation) {
      const gpsSuccess = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const locationData = await reverseGeocodeCoords(latitude, longitude);
              detectedLocation = locationData;
              setActiveCity(locationData);
              resolve(true);
            } catch (err) {
              console.warn('Error processing GPS coordinates:', err);
              resolve(false);
            }
          },
          (error) => {
            console.warn('Browser GPS geolocation error/denied:', error.message);
            resolve(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      if (gpsSuccess && detectedLocation) return true;
    }

    // Attempt 2: IP-based Location Fallback (if browser GPS was denied, timed out, or unavailable on desktop)
    const ipLocation = await detectLocationByIp();
    if (ipLocation) {
      const refined = await reverseGeocodeCoords(ipLocation.lat, ipLocation.lon);
      const finalLocation = {
        ...refined,
        name: refined.name !== 'Current Location' ? refined.name : ipLocation.name,
        state: refined.state || ipLocation.state,
        country: refined.country || ipLocation.country,
        lat: ipLocation.lat,
        lon: ipLocation.lon,
        isCurrentLocation: true,
      };
      setActiveCity(finalLocation);
      return true;
    }

    return false;
  };

  // Auto-detect user's current location whenever app is opened newly if setting enabled
  useEffect(() => {
    if (useCurrentLocationOnLaunch) {
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
