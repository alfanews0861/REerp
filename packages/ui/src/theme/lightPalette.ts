import { PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0B57D0', // MD3 Primary Sapphire
    light: '#4182E4',
    dark: '#00388A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#006A60', // MD3 Secondary Teal
    light: '#3B9A8F',
    dark: '#003731',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8F9FA', // MD3 Light Surface
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1F1F1F',
    secondary: '#444746',
    disabled: '#747775',
  },
  error: {
    main: '#BA1A1A',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#E06D00',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0265DC',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#128839',
    contrastText: '#FFFFFF',
  },
  divider: '#E1E3E1',
};
