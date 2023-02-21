import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import loaderReducer from "./loaderSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    loader: loaderReducer,
  },
});
