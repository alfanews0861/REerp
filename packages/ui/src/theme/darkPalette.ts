import './theme.d';
import { PaletteOptions } from '@mui/material/styles';

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#3B82F6', // Glowing Sapphire Token
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F59E0B', // Radiant Champagne Gold Token
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#0F172A',
  },
  background: {
    default: '#0B0F17', // OLED Obsidian Canvas
    paper: '#111827', // Deep Slate Surface
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#DC2626',
    contrastText: '#000000',
  },
  warning: {
    main: '#FBBF24',
    light: '#FDE68A',
    dark: '#D97706',
    contrastText: '#000000',
  },
  info: {
    main: '#38BDF8',
    light: '#7DD3FC',
    dark: '#0284C7',
    contrastText: '#000000',
  },
  success: {
    main: '#10B981', // Radiant Emerald
    light: '#34D399',
    dark: '#059669',
    contrastText: '#000000',
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  status: {
    lead: '#64748B',
    hot: '#F87171',
    warm: '#FBBF24',
    cold: '#38BDF8',
    booked: '#A855F7',
    sold: '#10B981',
    cancelled: '#475569',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    gold: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
    emerald: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    dark: 'linear-gradient(135deg, #1E293B 0%, #0B0F17 100%)',
    card: 'linear-gradient(180deg, #111827 0%, #0F172A 100%)',
  },
};

