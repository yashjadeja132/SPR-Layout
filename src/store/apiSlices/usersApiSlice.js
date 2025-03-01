import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com" }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/users?skip=${page - 1}&limit=${limit}`,
      keepUnusedDataFor: 300,
      providesTags: (result, error, { page }) => [{ type: "Users", id: page }],
    }),
  }),
});

export const { useGetUsersQuery, usePrefetch } = usersApiSlice;
