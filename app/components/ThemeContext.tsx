// context/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage and set CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedMode);
      updateThemeVariables(savedMode);
    }
  }, []);

  // Update CSS variables when theme changes
  const updateThemeVariables = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
      root.style.setProperty('--card-bg', '#1a1a1a');
      root.style.setProperty('--card-border', '#2d2d2d');
      root.style.setProperty('--primary', '#f97316'); // Orange for dark mode
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-border', '#e5e7eb');
      root.style.setProperty('--primary', '#ea580c'); // Orange for light mode
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    updateThemeVariables(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}