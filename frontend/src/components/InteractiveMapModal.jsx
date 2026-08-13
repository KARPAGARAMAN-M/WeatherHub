import React, { useState, useEffect, useRef } from 'react';
import { X, Layers, MapPin, Navigation, Thermometer, CloudRain, Wind, Cloud, Radio, Compass, RefreshCw } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

export default function InteractiveMapModal({ isOpen, onClose }) {
  const { activeCity, detectCurrentLocation, locationStatus, apiKey } = useWeatherContext();
  const [activeLayer, setActiveLayer] = useState('temp');
  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' | 'street' | 'satellite'

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const weatherTileRef = useRef(null);
  const baseTileRef = useRef(null);

  const lat = activeCity?.lat ?? 13.0827;
  const lon = activeCity?.lon ?? 80.2707;
  const cityName = activeCity?.name || 'Chennai';
  const isLocating = locationStatus === 'detecting';

  const mapLayers = [
    { id: 'temp', label: 'Temperature', icon: Thermometer, color: '#F59E0B', owm: 'temp_new' },
    { id: 'rain', label: 'Precipitation', icon: CloudRain, color: '#38BDF8', owm: 'precipitation_new' },
    { id: 'clouds', label: 'Cloud Cover', icon: Cloud, color: '#94A3B8', owm: 'clouds_new' },
    { id: 'wind', label: 'Wind Speed', icon: Wind, color: '#A855F7', owm: 'wind_new' },
    { id: 'radar', label: 'Live Radar', icon: Radio, color: '#EF4444', owm: 'precipitation_new' },
  ];

  // Base map tile URLs
  const getBaseTileUrl = (style) => {
    if (style === 'street') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    if (style === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    // Default dark CartoDB theme
    return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  };

  // Initialize and manage Leaflet map instance
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const L = window.L;
    if (!L) {
      console.warn('Leaflet JS is not loaded yet');
      return;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
      });

      // Add Base Layer
      const baseLayer = L.tileLayer(getBaseTileUrl(mapStyle), {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);
      baseTileRef.current = baseLayer;

      // Create Custom Pulsing Current Location Icon
      const customPulseIcon = L.divIcon({
        className: 'weatherhub-gps-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(56, 189, 248, 0.45); animation: mapPulse 1.8s infinite ease-in-out;"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background: #38BDF8; border: 3px solid #FFFFFF; box-shadow: 0 0 14px #38BDF8;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Add Marker at exact coordinates
      const marker = L.marker([lat, lon], { icon: customPulseIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <strong style="color: #0F172A; font-size: 0.95rem;">${cityName}</strong><br/>
          <span style="color: #64748B; font-size: 0.78rem;">Lat: ${lat.toFixed(4)}°, Lon: ${lon.toFixed(4)}°</span>
        </div>
      `);
      markerRef.current = marker;

      mapInstanceRef.current = map;
    }

    // Force Leaflet to recalculate container size on modal open
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        baseTileRef.current = null;
        weatherTileRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle lat / lon changes dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    mapInstanceRef.current.flyTo([lat, lon], 12, { duration: 1.2 });
    markerRef.current.setLatLng([lat, lon]);
    markerRef.current.setPopupContent(`
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <strong style="color: #0F172A; font-size: 0.95rem;">${cityName}</strong><br/>
        <span style="color: #64748B; font-size: 0.78rem;">Lat: ${lat.toFixed(4)}°, Lon: ${lon.toFixed(4)}°</span>
      </div>
    `);
  }, [lat, lon, cityName]);

  // Handle map style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileRef.current) return;
    const L = window.L;
    if (!L) return;

    mapInstanceRef.current.removeLayer(baseTileRef.current);
    const newBase = L.tileLayer(getBaseTileUrl(mapStyle), {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
    baseTileRef.current = newBase;
  }, [mapStyle]);

  // Handle weather tile layer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    if (weatherTileRef.current) {
      mapInstanceRef.current.removeLayer(weatherTileRef.current);
      weatherTileRef.current = null;
    }

    const selectedLayer = mapLayers.find(l => l.id === activeLayer);
    if (!selectedLayer) return;

    let weatherTileUrl = '';
    if (apiKey) {
      weatherTileUrl = `https://tile.openweathermap.org/map/${selectedLayer.owm}/{z}/{x}/{y}.png?appid=${apiKey}`;
    } else {
      // Free fallback weather tile overlay
      weatherTileUrl = `https://tile.openweathermap.org/map/${selectedLayer.owm}/{z}/{x}/{y}.png?appid=b1b15e88fa797225412429c1c50c122a1`;
    }

    const wLayer = L.tileLayer(weatherTileUrl, {
      opacity: 0.65,
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
    weatherTileRef.current = wLayer;
  }, [activeLayer, apiKey, isOpen]);

  const handleMyLocationClick = async () => {
    const success = await detectCurrentLocation({ isManualClick: true });
    if (success && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 13, { duration: 1.5 });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 250ms ease both',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes mapPulse {
          0% { transform: scale(0.8); opacity: 0.9; }
          50% { transform: scale(1.6); opacity: 0.3; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '1050px',
          height: '85vh',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.1rem 1.5rem',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--badge-bg)',
                color: 'var(--color-primary)',
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFF' }}>
                Interactive Live Weather Map & Precision Radar
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={13} style={{ color: 'var(--color-primary)' }} />
                Location: <strong style={{ color: 'var(--color-primary)' }}>{cityName}</strong> ({lat.toFixed(4)}°, {lon.toFixed(4)}°)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Map Style Selector */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--card-border)' }}>
              <button
                type="button"
                onClick={() => setMapStyle('dark')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  border: 'none',
                  background: mapStyle === 'dark' ? 'var(--color-primary)' : 'transparent',
                  color: mapStyle === 'dark' ? '#0F172A' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setMapStyle('street')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  border: 'none',
                  background: mapStyle === 'street' ? 'var(--color-primary)' : 'transparent',
                  color: mapStyle === 'street' ? '#0F172A' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Street
              </button>
              <button
                type="button"
                onClick={() => setMapStyle('satellite')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  border: 'none',
                  background: mapStyle === 'satellite' ? 'var(--color-primary)' : 'transparent',
                  color: mapStyle === 'satellite' ? '#0F172A' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Satellite
              </button>
            </div>

            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              title="Close Map"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Weather Layer Selection Toolbar */}
        <div
          style={{
            padding: '0.65rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.45)',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
            Weather Layers:
          </span>
          {mapLayers.map((layer) => {
            const IconComp = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                style={{
                  padding: '5px 13px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: isActive ? `1.5px solid ${layer.color}` : '1px solid var(--card-border)',
                  background: isActive ? `${layer.color}25` : 'transparent',
                  color: isActive ? layer.color : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <IconComp size={14} />
                {layer.label}
              </button>
            );
          })}
        </div>

        {/* Main Map Viewer Canvas */}
        <div style={{ flex: 1, position: 'relative', background: '#0F172A' }}>
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', zIndex: 1 }}
          />

          {/* Floating Map Controls: My Location Action Button */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <button
              type="button"
              onClick={handleMyLocationClick}
              disabled={isLocating}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1.5px solid var(--color-primary)',
                backdropFilter: 'blur(12px)',
                color: 'var(--color-primary)',
                fontWeight: '800',
                fontSize: '0.82rem',
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transition: 'all 200ms ease',
              }}
              title="Detect GPS & Center Map on My Location"
            >
              <Navigation size={15} className={isLocating ? 'animate-spin' : ''} />
              {isLocating ? 'Locating...' : 'My Location'}
            </button>
          </div>

          {/* Active Layer Status Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--card-border)',
              backdropFilter: 'blur(12px)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FFF',
              fontSize: '0.82rem',
              fontWeight: '700',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: mapLayers.find(l=>l.id===activeLayer)?.color || '#38BDF8',
                boxShadow: '0 0 8px currentColor',
              }}
            />
            Active Radar Layer: {mapLayers.find(l=>l.id===activeLayer)?.label}
          </div>
        </div>
      </div>
    </div>
  );
}
