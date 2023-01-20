import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    role: "",
    pseudonym: "",
    color: "",
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
      console.log(state);
      console.log(action);
    },
    updateEmail(state, action) {
      state.email = action.payload.email;
      console.log(state);
      console.log(action);
    },
  },
});

export const { updateRole, updateProfile, updateEmail } = userSlice.actions;
export default userSlice.reducer;
