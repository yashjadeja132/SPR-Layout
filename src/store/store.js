import { configureStore } from "@reduxjs/toolkit";

import { authApiSlice } from "./apiSlices/authApiSlice";
import { usersApiSlice } from "./apiSlices/usersApiSlice";

import authReducer from "./stateSlices/authStateSlice";
import usersReducer from "./stateSlices/usersStateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,

    users: usersReducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(usersApiSlice.middleware),
});

export default store;
