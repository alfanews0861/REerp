import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  items: AppNotification[];
}

const initialState: NotificationState = {
  items: [],
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<AppNotification, 'id' | 'read' | 'createdAt'>>) => {
      state.items.unshift({
        ...action.payload,
        id: `notif_${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.read = true;
    },
    clearAll: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;
