import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X, ChevronRight, Globe } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useGeocoding } from '../hooks/useWeather';
import { useWeatherContext } from '../context/WeatherContext';
import { getCountryName } from '../utils/formatters';

export default function SearchBar() {
  const { setActiveCity } = useWeatherContext();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const { suggestions, isSearching } = useGeocoding(debouncedQuery);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleSelectCity = (cityObj) => {
    setActiveCity({
      name: cityObj.name,
      state: cityObj.state || '',
      country: cityObj.country || '',
      lat: cityObj.lat,
      lon: cityObj.lon,
    });
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectCity(suggestions[selectedIndex]);
    } else if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    } else {
      setActiveCity({ name: cleanQuery });
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div ref={dropdownRef} className="search-container">
      <form onSubmit={handleSubmit} className="search-input-wrapper">
        {/* Left Search Icon */}
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: query ? 'var(--color-primary)' : 'var(--color-text-muted)',
            pointerEvents: 'none',
            transition: 'color 300ms ease',
            zIndex: 2,
          }}
        />

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search city, town, village, state, country..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search city, town, village, state, or country"
        />

        {/* Right Clear (×) Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setSelectedIndex(-1);
              if (inputRef.current) inputRef.current.focus();
            }}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease',
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Floating Glassmorphic Autocomplete Dropdown */}
      {isOpen && (query.trim().length >= 1 || isSearching) && (
        <div className="search-dropdown">
          {isSearching && (
            <div
              style={{
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
              Searching locations...
            </div>
          )}

          {!isSearching && suggestions.length === 0 && (
            <div style={{ padding: '16px 18px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Location not found. Please try a different city, town, or country.
            </div>
          )}

          {!isSearching &&
            suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const fullCountry = getCountryName(item.country);
              const subDetails = [item.state, fullCountry].filter(Boolean).join(', ');

              return (
                <div
                  key={`${item.name}-${item.state}-${item.country}-${item.lat}-${item.lon}-${idx}`}
                  className={`search-suggestion-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectCity(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      className="suggestion-icon"
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--badge-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)',
                        transition: 'transform 200ms ease, color 200ms ease',
                      }}
                    >
                      <MapPin size={16} />
                    </div>

                    <div>
                      <div className="suggestion-city" style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '0.96rem' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Globe size={11} style={{ opacity: 0.7 }} />
                        {subDetails || 'Global'}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', opacity: 0.6 }} />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

