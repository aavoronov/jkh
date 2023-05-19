import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    visible: false,
  },
  reducers: {
    loading(state, action) {
      state.visible = action.payload.visible;
    },
  },
});

export const { loading } = loaderSlice.actions;
export default loaderSlice.reducer;
