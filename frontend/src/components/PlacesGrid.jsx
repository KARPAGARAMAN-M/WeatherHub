import React, { useState } from 'react';
import { Clock3, MapPin, Trash2 } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { formatLocationSubline } from '../utils/formatters';

function RecentSearchCard({ location, isSelected }) {
  const { setActiveCity } = useWeatherContext();
  const [isHovered, setIsHovered] = useState(false);
  const subLocation = formatLocationSubline(location);

  return (
    <button
      type="button"
      className="metric-card animate-slideUp"
      onClick={() => setActiveCity(location)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        textAlign: 'left',
        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--card-border)',
        boxShadow: isSelected || isHovered ? '0 0 20px var(--color-primary-glow)' : 'var(--shadow-glass)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        minHeight: '110px',
        padding: '1.15rem',
        borderRadius: 'var(--radius-xl)',
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'var(--card-bg)',
      }}
    >
      <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>
        {location.name}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '7px' }}>
        <MapPin size={12} style={{ color: 'var(--color-primary)' }} />
        {subLocation || location.country || 'Location'}
      </div>
    </button>
  );
}

export default function PlacesGrid() {
  const { recentSearches, activeCity, clearRecentSearches } = useWeatherContext();

  return (
    <section style={{ marginBottom: '2rem' }} aria-labelledby="recent-searches-heading">
      <div className="section-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock3 size={20} />
          <h3 id="recent-searches-heading">Recent Searches</h3>
        </div>
        {recentSearches.length > 0 && (
          <button type="button" className="btn-ghost" onClick={clearRecentSearches} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '0.45rem 0.7rem' }}>
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      {recentSearches.length === 0 ? (
        <div className="surface-card" style={{ padding: '1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Your recent searches will appear here.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
          {recentSearches.map((location) => (
            <RecentSearchCard
              key={`${location.name}-${location.lat ?? ''}-${location.lon ?? ''}`}
              location={location}
              isSelected={activeCity?.name?.toLowerCase() === location.name?.toLowerCase()}
            />
          ))}
        </div>
      )}
    </section>
  );
}
