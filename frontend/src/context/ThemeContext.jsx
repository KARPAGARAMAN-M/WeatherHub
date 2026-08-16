import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WEATHER_THEMES, getThemeForCondition, applyThemeToDOM } from '../utils/weatherTheme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentCondition, setCurrentCondition] = useState('Clear');
  const [iconCode, setIconCode] = useState('01d');
  const [sysData, setSysData] = useState(null);
  const [dtTimestamp, setDtTimestamp] = useState(null);
  const [extraMetrics, setExtraMetrics] = useState({});

  // Derive theme strictly based on weather condition, icon code, daylight, and metrics
  const activeTheme = getThemeForCondition(currentCondition, iconCode, sysData, dtTimestamp, extraMetrics);

  const updateCondition = useCallback((conditionMain, icon = '', sys = null, dt = null, extra = {}) => {
    if (conditionMain) setCurrentCondition(conditionMain);
    if (icon) setIconCode(icon);
    if (sys) setSysData(sys);
    if (dt) setDtTimestamp(dt);
    if (extra) setExtraMetrics(extra);
  }, []);

  useEffect(() => {
    applyThemeToDOM(activeTheme);
  }, [activeTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentCondition,
        iconCode,
        theme: activeTheme,
        updateCondition,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
