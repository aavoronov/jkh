import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    phone: "",
    role: "",
    pseudonym: "",
    color: "",
    profilePic: "",
    notifications: 0,
    balance: 0,
    address: "",
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
    updatePhone(state, action) {
      state.phone = action.payload.phone;
    },
    updateNotifications(state, action) {
      state.notifications = action.payload.notifications;
    },
    updateBalance(state, action) {
      state.balance = action.payload.balance;
    },
    updateAddress(state, action) {
      state.address = action.payload.address;
    },
  },
});

export const { updateRole, updateProfile, updateEmail, updateNotifications, updatePhone, updateBalance, updateAddress } = userSlice.actions;
export default userSlice.reducer;
