import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  toasts: [],
}

let toastId = 0

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload
    },
    addToast(state, action) {
      state.toasts.push({ id: ++toastId, ...action.payload })
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { toggleSidebar, setSidebarOpen, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer
