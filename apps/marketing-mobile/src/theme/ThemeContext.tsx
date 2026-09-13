import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, MobileColors } from './colors';
import { shadows } from './shadows';
import { typography } from './typography';

export type MobileThemeMode = 'light' | 'dark' | 'system';

export interface MobileTheme {
  colors: MobileColors;
  shadows: typeof shadows;
  typography: typeof typography;
  isDark: boolean;
  mode: MobileThemeMode;
  setMode: (mode: MobileThemeMode) => void;
  toggleTheme: () => void;
}

const MobileThemeContext = createContext<MobileTheme>({
  colors: lightColors,
  shadows,
  typography,
  isDark: false,
  mode: 'light',
  setMode: () => {},
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = '@reerp_mobile_theme_mode';

export const MobileThemeProvider: React.FC<{ children: ReactNode; defaultMode?: MobileThemeMode }> = ({
  children,
  defaultMode = 'light',
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<MobileThemeMode>(defaultMode);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'dark') {
          AsyncStorage.setItem(THEME_STORAGE_KEY, 'light').catch(() => {});
          setModeState('light');
        } else if (saved === 'light') {
          setModeState('light');
        }
      })
      .catch(() => {});
  }, []);

  const setMode = (newMode: MobileThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode).catch(() => {});
  };

  const isDark = useMemo(() => {
    return mode === 'dark';
  }, [mode]);

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  const themeValue = useMemo<MobileTheme>(
    () => ({
      colors,
      shadows,
      typography,
      isDark,
      mode,
      setMode,
      toggleTheme,
    }),
    [colors, isDark, mode]
  );

  return (
    <MobileThemeContext.Provider value={themeValue}>
      {children}
    </MobileThemeContext.Provider>
  );
};

export const useMobileTheme = (): MobileTheme => useContext(MobileThemeContext);
