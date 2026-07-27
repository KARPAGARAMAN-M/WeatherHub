import React, { createContext, useContext, useState, useEffect } from 'react';
import { getThemeForCondition, applyThemeToDOM } from '../utils/weatherTheme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentCondition, setCurrentCondition] = useState('Clear');
  const [theme, setTheme] = useState(() => getThemeForCondition('Clear'));

  const updateCondition = (conditionStr) => {
    if (!conditionStr) return;
    setCurrentCondition(conditionStr);
    const newTheme = getThemeForCondition(conditionStr);
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ currentCondition, theme, updateCondition }}>
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
