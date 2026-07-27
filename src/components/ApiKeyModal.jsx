import React, { useState } from 'react';
import { Key, X, Check, Info, ExternalLink, Sparkles } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';

export default function ApiKeyModal() {
  const { apiKey, updateApiKey, isKeyModalOpen, setIsKeyModalOpen } = useWeatherContext();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isKeyModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateApiKey(inputKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsKeyModalOpen(false);
    }, 1000);
  };

  const handleClear = () => {
    setInputKey('');
    updateApiKey('');
    setIsKeyModalOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          position: 'relative',
          background: 'rgba(25, 30, 45, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}
      >
        <button
          onClick={() => setIsKeyModalOpen(false)}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div
            style={{
              background: 'rgba(255, 213, 79, 0.2)',
              padding: '10px',
              borderRadius: '12px',
              color: 'var(--color-primary)',
            }}
          >
            <Key size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>OpenWeather API Key</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              Configure your free key or use built-in Demo Mode
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.4rem',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              API Key (stored safely in local browser memory)
            </label>
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. 8a3f910e4b..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '10px',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <Info size={18} style={{ flexShrink: 0, color: 'var(--color-sky)', marginTop: '2px' }} />
            <div>
              Don't have a key? Get a free API key at{' '}
              <a
                href="https://home.openweathermap.org/users/sign_up"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                OpenWeatherMap <ExternalLink size={12} />
              </a>
              . Or leave empty to keep using <strong>Demo / Mock Mode</strong>!
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {apiKey && (
              <button
                type="button"
                className="btn-glass"
                onClick={handleClear}
                style={{ color: '#ff6b6b' }}
              >
                Clear Key (Demo Mode)
              </button>
            )}
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {savedSuccess ? <Check size={16} /> : <Sparkles size={16} />}
              {savedSuccess ? 'Saved!' : 'Save & Refresh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
