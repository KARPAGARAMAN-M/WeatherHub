import React, { useState, useEffect } from 'react';
import { Grid, Trash2 } from 'lucide-react';
import { formatTemp } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';
import { MOCK_WEATHER_DATABASE } from '../utils/mockData';

function SavedCityCard({ cityObj, isSelected }) {
  const { setActiveCity, removeSavedCity, unit, apiKey } = useWeatherContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const cityName = cityObj.name;

    const params = new URLSearchParams();
    if (cityObj.lat && cityObj.lon) {
      params.append('lat', cityObj.lat);
      params.append('lon', cityObj.lon);
    } else {
      params.append('city', cityName);
    }
    if (apiKey) params.append('apiKey', apiKey);

    fetch(`/api/weather/current?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (isMounted && resData) {
          setData(resData);
        } else if (isMounted) {
          const mock = MOCK_WEATHER_DATABASE[cityName] || MOCK_WEATHER_DATABASE['London'];
          setData(mock.current);
        }
      })
      .catch((err) => {
        console.warn('Saved city fetch failed:', err);
        if (isMounted) {
          const mock = MOCK_WEATHER_DATABASE[cityName] || MOCK_WEATHER_DATABASE['London'];
          setData(mock.current);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cityObj, apiKey]);

  const condition = data?.weather?.[0] || {};
  const iconUrl = condition.icon ? `https://openweathermap.org/img/wn/${condition.icon}.png` : null;

  return (
    <div
      className="glass-card-sm"
      style={{
        padding: '1.2rem',
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: isSelected ? '0 0 15px var(--color-primary)' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '130px',
        transition: 'all 0.25s ease',
      }}
      onClick={() => setActiveCity(cityObj)}
    >
      {/* Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeSavedCity(cityObj.name);
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b6b')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
        title="Remove city from saved list"
      >
        <Trash2 size={14} />
      </button>

      {/* Header */}
      <div>
        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', paddingRight: '20px' }}>
          {cityObj.name}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
          {cityObj.country || data?.sys?.country || ''}
        </div>
      </div>

      {/* Weather Stat Footer */}
      {loading ? (
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-primary)' }}>
            {formatTemp(data?.main?.temp, unit)}
          </div>
          {iconUrl && <img src={iconUrl} alt={condition.main} style={{ width: '40px', height: '40px' }} />}
        </div>
      )}
    </div>
  );
}

export default function PlacesGrid() {
  const { savedCities, activeCity } = useWeatherContext();

  if (!savedCities || savedCities.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>Saved Places Dashboard</h3>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          Click a city to view deep forecast
        </div>
      </div>

      {/* Grid of Saved Cities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
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
