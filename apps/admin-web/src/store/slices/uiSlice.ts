import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  notificationDrawerOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  notificationDrawerOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleNotificationDrawer: (state) => {
      state.notificationDrawerOpen = !state.notificationDrawerOpen;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleNotificationDrawer } = uiSlice.actions;
export default uiSlice.reducer;
