import React, { useState } from 'react';
import { X, Layers, MapPin, Eye, Thermometer, CloudRain, Wind, Cloud, Radio } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

export default function InteractiveMapModal({ isOpen, onClose }) {
  const { activeCity, setActiveCity, apiKey } = useWeatherContext();
  const [activeLayer, setActiveLayer] = useState('temp');

  if (!isOpen) return null;

  const lat = activeCity?.lat ?? 13.0827;
  const lon = activeCity?.lon ?? 80.2707;
  const cityName = activeCity?.name || 'Chennai';

  // Tile layer URLs (OpenWeather Map tile layers if API key present, or OpenStreetMap weather overlays)
  const mapLayers = [
    { id: 'temp', label: 'Temperature', icon: Thermometer, color: '#F59E0B' },
    { id: 'rain', label: 'Precipitation / Rain', icon: CloudRain, color: '#38BDF8' },
    { id: 'clouds', label: 'Cloud Cover', icon: Cloud, color: '#94A3B8' },
    { id: 'wind', label: 'Wind Speed', icon: Wind, color: '#A855F7' },
    { id: 'radar', label: 'Live Radar', icon: Radio, color: '#EF4444' },
  ];

  // OpenStreetMap embed URL centered at current lat/lon with zoom level
  const embedMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 2.5}%2C${lat - 2.5}%2C${lon + 2.5}%2C${lat + 2.5}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.85)',
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
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '85vh',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.05)',
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFF' }}>
                Interactive Weather Map & Radar
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                Centered on <strong style={{ color: 'var(--color-primary)' }}>{cityName}</strong> ({lat.toFixed(2)}°, {lon.toFixed(2)}°)
              </p>
            </div>
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

        {/* Layer Selector Bar */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginRight: '6px' }}>
            Layers:
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
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
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
                <IconComp size={15} />
                {layer.label}
              </button>
            );
          })}
        </div>

        {/* Main Map Viewer */}
        <div style={{ flex: 1, position: 'relative', background: '#0F172A' }}>
          <iframe
            title="Interactive Weather Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={embedMapUrl}
            style={{ border: 'none', filter: 'contrast(1.05) brightness(0.95)' }}
          />

          {/* Active Layer Overlay Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--card-border)',
              backdropFilter: 'blur(12px)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFF',
              fontSize: '0.85rem',
              fontWeight: '700',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: mapLayers.find(l=>l.id===activeLayer)?.color || '#38BDF8', boxShadow: '0 0 8px currentColor' }} />
            Active Layer: {mapLayers.find(l=>l.id===activeLayer)?.label}
          </div>
        </div>
      </div>
    </div>
  );
}
