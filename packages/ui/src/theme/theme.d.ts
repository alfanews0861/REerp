import '@mui/material/styles';

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
