// context/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { orange, grey, deepOrange } from '@mui/material/colors';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  // Custom orange/black theme for Material-UI
  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? orange[500] : deepOrange[700],
      },
      background: {
        default: darkMode ? grey[900] : grey[50],
        paper: darkMode ? grey[800] : '#ffffff',
      },
      text: {
        primary: darkMode ? orange[200] : grey[900],
        secondary: darkMode ? grey[400] : grey[600],
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? grey[800] : '#ffffff',
            borderColor: darkMode ? grey[700] : grey[200],
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={muiTheme}>
        <div className={`${darkMode ? 'dark' : ''}`}>
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {children}
          </div>
        </div>
      </MuiThemeProvider>
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