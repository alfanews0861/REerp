import { createTheme, Theme, responsiveFontSizes } from '@mui/material/styles';
import { lightPalette } from './lightPalette';
import { darkPalette } from './darkPalette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { spacingMultiplier } from './spacing';

export function createAppTheme(mode: 'light' | 'dark'): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  const theme = createTheme({
    palette,
    typography,
    breakpoints,
    spacing: spacingMultiplier,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20, // MD3 Pill style buttons
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16, // MD3 Surface container rounded corners
            boxShadow: mode === 'dark' 
              ? '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.3)'
              : '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}

export * from './lightPalette';
export * from './darkPalette';
export * from './typography';
export * from './breakpoints';
export * from './spacing';
