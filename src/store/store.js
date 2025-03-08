import { configureStore } from "@reduxjs/toolkit";

import { authApiSlice } from "./apiSlices/authApiSlice";
import { userApiSlice } from "./apiSlices/userApiSlice";

import authReducer from "./stateSlices/authStateSlice";
import usersReducer from "./stateSlices/usersStateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,

    users: usersReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(userApiSlice.middleware),
});

export default store;
