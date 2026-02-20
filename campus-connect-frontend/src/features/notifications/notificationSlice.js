import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../services/api/client";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const res = await client.get("/notifications");
    return res.data.notifications;
  }
);


export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id) => {
    await client.patch(`/notifications/${id}/read`);
    return id;
  }
);


export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async () => {
    await client.patch("/notifications/read-all");
    return true;
  }
);


export const deleteNotificationAsync = createAsyncThunk(
  "notifications/delete",
  async (id) => {
    await client.delete(`/notifications/${id}`);
    return id;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount = state.items.filter(n => !n.isRead).length;
    },
  },
  extraReducers: (builder) => {
    builder

      
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })

      
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notif = state.items.find(n => n._id === action.payload);
        if (notif) notif.isRead = true;
        state.unreadCount = state.items.filter(n => !n.isRead).length;
      })

      
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })

      
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(n => n._id !== action.payload);
        state.unreadCount = state.items.filter(n => !n.isRead).length;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
