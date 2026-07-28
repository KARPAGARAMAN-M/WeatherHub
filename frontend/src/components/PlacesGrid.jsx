import React, { useState, useEffect } from 'react';
import { Grid, X, MapPin } from 'lucide-react';
import { formatTemp, getCountryName } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';
import { getThemeForCondition } from '../utils/weatherTheme';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

function SavedCityCard({ cityObj, isSelected }) {
  const { setActiveCity, removeSavedCity, unit, apiKey } = useWeatherContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams();
    if (cityObj.lat && cityObj.lon) {
      params.append('lat', cityObj.lat);
      params.append('lon', cityObj.lon);
    } else {
      params.append('city', cityObj.name);
    }
    if (apiKey) params.append('apiKey', apiKey);

    fetch(`/api/weather/current?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        if (isMounted) setData(resData);
      })
      .catch(() => {
        if (isMounted) setError('Failed');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [cityObj, apiKey]);

  const condMain = data?.weather?.[0]?.main || 'Clear';
  const iconCode = data?.weather?.[0]?.icon || '01d';
  const cityTheme = getThemeForCondition(condMain, iconCode, data?.sys, data?.dt);

  const countryName = getCountryName(cityObj.country || data?.sys?.country || '');
  const subLocation = [cityObj.state, countryName].filter(Boolean).join(', ');

  return (
    <div
      className="metric-card animate-slideUp"
      style={{
        cursor: 'pointer',
        border: isSelected
          ? '2px solid var(--color-primary)'
          : '1px solid var(--card-border)',
        boxShadow: isSelected ? '0 0 16px var(--color-primary-glow)' : 'var(--shadow-glass)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '135px',
        padding: '1.1rem',
        transition: 'all 300ms ease',
      }}
      onClick={() => setActiveCity(cityObj)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeSavedCity(cityObj);
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          opacity: isHovered ? 1 : 0,
          transition: 'all 200ms ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        title="Remove location"
      >
        <X size={14} />
      </button>

      {/* City & Country */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)', paddingRight: '24px' }}>
          {cityObj.name}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
          <MapPin size={12} style={{ color: 'var(--color-primary)' }} />
          {subLocation || 'Global'}
        </div>
      </div>

      {/* Weather Info & Animated Icon */}
      {loading ? (
        <div style={{ marginTop: '12px' }}>
          <div className="skeleton" style={{ width: '60px', height: '24px' }} />
        </div>
      ) : error ? (
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '12px' }}>--</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: 1 }}>
            {formatTemp(data?.main?.temp, unit)}
          </div>
          <AnimatedWeatherIcon themeKey={cityTheme.key} size={42} />
        </div>
      )}
    </div>
  );
}

export default function PlacesGrid() {
  const { savedCities, activeCity } = useWeatherContext();

  if (!savedCities || savedCities.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-heading">
        <Grid size={20} />
        <h3>Saved Locations</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem',
        }}
      >
        {savedCities.map((city, idx) => (
          <SavedCityCard
            key={`${city.name}-${idx}`}
            cityObj={city}
            isSelected={activeCity?.name?.toLowerCase() === city.name.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
}
