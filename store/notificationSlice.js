import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    text: "",
    type: null,
  },
  reducers: {
    toggle(state, action) {
      state.text = action.payload.text;
      state.type = action.payload.type;
    },
  },
});

export const { toggle } = notificationSlice.actions;
export default notificationSlice.reducer;
