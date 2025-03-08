import { configureStore } from "@reduxjs/toolkit";

import { authApiSlice } from "./apiSlices/authApiSlice";
import { userApiSlice } from "./apiSlices/userApiSlice";
import { usersApiSlice } from "./apiSlices/usersApiSlice";
import { ticketApiSlice } from "./apiSlices/ticketApiSlice";

import authReducer from "./stateSlices/authStateSlice";
import usersReducer from "./stateSlices/usersStateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,

    users: usersReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [ticketApiSlice.reducerPath]: ticketApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(usersApiSlice.middleware)
      .concat(ticketApiSlice.middleware),
});

export default store;
