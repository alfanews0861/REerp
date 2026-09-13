import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  linkUrl?: string;
  category?: 'message' | 'alert' | 'system';
}

interface NotificationState {
  items: AppNotification[];
  unreadMessagesCount: number;
  unreadAlertsCount: number;
  activeConversationId: string | null;
  drawerOpen: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadMessagesCount: 0,
  unreadAlertsCount: 0,
  activeConversationId: null,
  drawerOpen: false,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.items = action.payload;
      state.unreadAlertsCount = action.payload.filter((item) => !item.read).length;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<AppNotification, 'id' | 'read' | 'createdAt'>>
    ) => {
      state.items.unshift({
        ...action.payload,
        id: `notif_${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      state.unreadAlertsCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        if (state.unreadAlertsCount > 0) state.unreadAlertsCount -= 1;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
      state.unreadAlertsCount = 0;
    },
    setUnreadMessagesCount: (state, action: PayloadAction<number>) => {
      state.unreadMessagesCount = action.payload;
    },
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    setNotificationDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    clearAll: (state) => {
      state.items = [];
      state.unreadAlertsCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllNotificationsAsRead,
  setUnreadMessagesCount,
  setActiveConversationId,
  setNotificationDrawerOpen,
  clearAll,
} = notificationSlice.actions;

export default notificationSlice.reducer;
