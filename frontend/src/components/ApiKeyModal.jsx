import React, { useState, useEffect } from 'react';
import { Settings, X, Check, Key, ExternalLink } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

export default function ApiKeyModal() {
  const { apiKey, updateApiKey, isSettingsOpen, setIsSettingsOpen, unit, toggleUnit } = useWeatherContext();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setInputKey(apiKey || '');
  }, [apiKey]);

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateApiKey(inputKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    updateApiKey('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      className="animate-fadeIn"
    >
      <div
        className="surface-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          position: 'relative',
          background: 'var(--bg-surface)',
          border: '1px solid var(--color-border-hover)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-dropdown)',
        }}
      >
        <button
          onClick={() => setIsSettingsOpen(false)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
          title="Close Settings"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)',
              display: 'flex',
            }}
          >
            <Settings size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text)' }}>Settings</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Configure API preferences & temperature units
            </p>
          </div>
        </div>

        {/* Temperature Unit Toggle Section */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '0.6rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            Temperature Unit
          </label>
          <div className="tab-group" style={{ width: '100%', display: 'flex' }}>
            <button
              type="button"
              onClick={() => { if (unit !== 'C') toggleUnit(); }}
              className={unit === 'C' ? 'active' : ''}
              style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: '0.875rem' }}
            >
              Celsius (°C)
            </button>
            <button
              type="button"
              onClick={() => { if (unit !== 'F') toggleUnit(); }}
              className={unit === 'F' ? 'active' : ''}
              style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: '0.875rem' }}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Key size={14} style={{ color: 'var(--color-primary)' }} />
                OpenWeatherMap API Key
              </label>
            </div>
            <input
              type="password"
              className="settings-input"
              placeholder="Enter your API key..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: '1.4',
            }}
          >
            Get a free key at{' '}
            <a
              href="https://home.openweathermap.org/users/sign_up"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '500' }}
            >
              OpenWeatherMap <ExternalLink size={11} />
            </a>
            . Stored locally in your browser memory.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {apiKey ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={handleClear}
                style={{ color: 'var(--color-error)', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.8rem' }}
              >
                Remove Key
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {savedSuccess ? <Check size={16} /> : null}
                {savedSuccess ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
