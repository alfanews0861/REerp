import { PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    status: {
      lead: string;
      hot: string;
      warm: string;
      cold: string;
      booked: string;
      sold: string;
      cancelled: string;
    };
  }
  interface PaletteOptions {
    status?: {
      lead: string;
      hot: string;
      warm: string;
      cold: string;
      booked: string;
      sold: string;
      cancelled: string;
    };
  }
}


export const corporatePalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0a369d',
    light: '#4d60ce',
    dark: '#00116e',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#4470ad',
    light: '#789edz',
    dark: '#09457d',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f4f6f8',
    paper: '#ffffff',
  },
  text: {
    primary: '#1c2b36',
    secondary: '#5c6e7e',
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#ed6c02',
  },
  info: {
    main: '#0288d1',
  },
  success: {
    main: '#2e7d32',
  },
  status: {
    lead: '#e0e0e0', // gray
    hot: '#d32f2f', // red
    warm: '#ed6c02', // orange
    cold: '#0288d1', // blue
    booked: '#9c27b0', // purple
    sold: '#2e7d32', // green
    cancelled: '#757575', // dark gray
  },
};
