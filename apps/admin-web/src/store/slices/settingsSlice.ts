import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  currency: string;
  dateFormat: string;
  autoRefreshInterval: number;
}

const initialState: SettingsState = {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  autoRefreshInterval: 30000,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
