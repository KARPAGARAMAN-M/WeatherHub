import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useGeocoding } from '../hooks/useWeather';
import { useWeatherContext } from '../context/WeatherContext';

export default function SearchBar() {
  const { setActiveCity } = useWeatherContext();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { suggestions, isSearching } = useGeocoding(debouncedQuery);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (cityObj) => {
    setActiveCity({
      name: cityObj.name,
      country: cityObj.country,
      lat: cityObj.lat,
      lon: cityObj.lon,
    });
    setQuery('');
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    } else {
      setActiveCity({ name: query.trim() });
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.7)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          className="glass-input"
          placeholder="Search city or location worldwide..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && (query.trim().length >= 2 || isSearching) && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'rgba(20, 25, 35, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 100,
            overflow: 'hidden',
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {isSearching && (
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '0.9rem' }}>
              <Loader2 size={16} className="animate-spin" /> Searching cities...
            </div>
          )}

          {!isSearching && suggestions.length === 0 && (
            <div style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              No matching locations found. Press Enter to search "{query}".
            </div>
          )}

          {!isSearching &&
            suggestions.map((item, idx) => (
              <div
                key={`${item.name}-${item.lat}-${item.lon}-${idx}`}
                onClick={() => handleSelectCity(item)}
                style={{
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.95rem' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                    {item.state ? `${item.state}, ` : ''}{item.country}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
