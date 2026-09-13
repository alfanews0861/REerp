import './theme.d';
import { PaletteOptions } from '@mui/material/styles';

export const corporatePalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0A192F', // Deep Imperial Midnight Navy
    light: '#1E3A8A',
    dark: '#030712',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#D97706', // Royal Champagne Gold / Amber
    light: '#F59E0B',
    dark: '#92400E',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F1F5F9', // Luxury Slate Alabaster
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#94A3B8',
  },
  error: {
    main: '#DC2626',
    light: '#EF4444',
    dark: '#991B1B',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#D97706',
    light: '#FBBF24',
    dark: '#B45309',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0284C7',
    light: '#38BDF8',
    dark: '#0369A1',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#059669', // Emerald Wealth Token
    light: '#10B981',
    dark: '#065F46',
    contrastText: '#FFFFFF',
  },
  divider: '#E2E8F0',
  status: {
    lead: '#94A3B8',
    hot: '#DC2626',
    warm: '#D97706',
    cold: '#0284C7',
    booked: '#7C3AED',
    sold: '#059669',
    cancelled: '#64748B',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%)',
    gold: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    emerald: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    dark: 'linear-gradient(135deg, #0F172A 0%, #0A192F 100%)',
    card: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
  },
};

