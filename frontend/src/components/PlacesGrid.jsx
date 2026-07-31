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

  const tempMax = data?.main?.temp_max != null ? data.main.temp_max : (data?.main?.temp != null ? data.main.temp + 2 : null);
  const tempMin = data?.main?.temp_min != null ? data.main.temp_min : (data?.main?.temp != null ? data.main.temp - 2 : null);

  return (
    <div
      className="metric-card animate-slideUp"
      style={{
        cursor: 'pointer',
        border: isSelected
          ? '2px solid var(--color-primary)'
          : isHovered
          ? '1.5px solid var(--card-border-hover)'
          : '1px solid var(--card-border)',
        boxShadow: isSelected
          ? '0 0 20px var(--color-primary-glow)'
          : isHovered
          ? '0 8px 25px rgba(0,0,0,0.4), 0 0 14px var(--color-primary-glow)'
          : 'var(--shadow-glass)',
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '145px',
        padding: '1.15rem',
        borderRadius: 'var(--radius-xl)',
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={() => setActiveCity(cityObj)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delete / Remove Location Button */}
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
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          opacity: isHovered ? 1 : 0.6,
          transition: 'all 200ms ease',
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.background = '#EF4444';
          e.currentTarget.style.borderColor = '#EF4444';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
        title="Delete saved location"
      >
        <X size={14} />
      </button>

      {/* City & Location details */}
      <div>
        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)', paddingRight: '24px' }}>
          {cityObj.name}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
          <MapPin size={12} style={{ color: 'var(--color-primary)' }} />
          {subLocation || 'Global'}
        </div>
      </div>

      {/* Weather Info, High/Low Temps & Animated Icon */}
      {loading ? (
        <div style={{ marginTop: '12px' }}>
          <div className="skeleton" style={{ width: '70px', height: '24px', marginBottom: '6px' }} />
          <div className="skeleton" style={{ width: '90px', height: '14px' }} />
        </div>
      ) : error ? (
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '12px' }}>--</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '12px' }}>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {formatTemp(data?.main?.temp, unit)}
            </div>
            {/* Today's High and Low Temps */}
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '6px', fontWeight: '600' }}>
              H: {formatTemp(tempMax, unit)} • L: {formatTemp(tempMin, unit)}
            </div>
          </div>

          <div style={{ marginBottom: '-4px' }}>
            <AnimatedWeatherIcon themeKey={cityTheme.key} size={46} />
          </div>
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
