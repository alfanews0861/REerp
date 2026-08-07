import { PaletteOptions } from '@mui/material/styles';

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#A8C7FA', // MD3 Dark Primary Sapphire Token
    light: '#D3E3FD',
    dark: '#004AAB',
    contrastText: '#002D6D',
  },
  secondary: {
    main: '#78D7CC', // MD3 Dark Secondary Teal Token
    light: '#A0F4E8',
    dark: '#005048',
    contrastText: '#003731',
  },
  background: {
    default: '#121316', // MD3 Dark Surface Container
    paper: '#1E1F23',
  },
  text: {
    primary: '#E2E2E6',
    secondary: '#C4C6C0',
    disabled: '#8E918F',
  },
  error: {
    main: '#FFB4AB',
    contrastText: '#690005',
  },
  warning: {
    main: '#FFB784',
    contrastText: '#4D2200',
  },
  info: {
    main: '#A0C7FF',
    contrastText: '#003062',
  },
  success: {
    main: '#74DC89',
    contrastText: '#003913',
  },
  divider: '#444746',
};
