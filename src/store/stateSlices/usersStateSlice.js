import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
});

export const { setPage, setLimit } = usersSlice.actions;
export default usersSlice.reducer;
