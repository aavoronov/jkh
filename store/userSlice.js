import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    role: "",
    pseudonym: "",
    color: "",
    profilePic: "",
    notifications: 0,
  },
  reducers: {
    updateRole(state, action) {
      state.role = action.payload.role;
      console.log(state);
      console.log(action);
    },
    updateProfile(state, action) {
      state.pseudonym = action.payload.pseudonym;
      state.color = action.payload.color;
      state.profilePic = action.payload.profilePic;
      console.log(state);
      console.log(action);
    },
    updateEmail(state, action) {
      state.email = action.payload.email;
      console.log(state);
      console.log(action);
    },
    updateNotifications(state, action) {
      state.notifications = action.payload.notifications;
    },
  },
});

export const { updateRole, updateProfile, updateEmail, updateNotifications } = userSlice.actions;
export default userSlice.reducer;
