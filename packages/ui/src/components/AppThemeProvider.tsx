import { createContext, useContext, useMemo, useState, useEffect, ReactNode, FC } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  actualMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface AppThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({
  children,
  defaultMode = 'light',
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_theme_mode') as ThemeMode;
      if (saved === 'dark') {
        localStorage.setItem('app_theme_mode', 'light');
        return 'light';
      }
      return saved || defaultMode;
    }
    return defaultMode;
  });

  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const actualMode: 'light' | 'dark' = mode === 'system' ? systemMode : mode;

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_theme_mode', newMode);
    }
  };

  const toggleTheme = () => {
    setMode(actualMode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(() => createAppTheme(actualMode), [actualMode]);

  return (
    <ThemeContext.Provider value={{ mode, actualMode, setMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
};
