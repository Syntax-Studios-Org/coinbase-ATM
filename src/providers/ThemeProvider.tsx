"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeColors, defaultTheme, themeToCSSProperties } from '@/config/theme';

interface ThemeContextType {
  theme: ThemeColors;
  setTheme: (theme: ThemeColors) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeColors;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = defaultTheme 
}) => {
  const [theme, setThemeState] = useState<ThemeColors>(initialTheme);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const cssProperties = themeToCSSProperties(theme);
    const root = document.documentElement;
    
    Object.entries(cssProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);

  const setTheme = (newTheme: ThemeColors) => {
    setThemeState(newTheme);
    // Optionally save to localStorage
    localStorage.setItem('atm-theme', JSON.stringify(newTheme));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.removeItem('atm-theme');
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('atm-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};