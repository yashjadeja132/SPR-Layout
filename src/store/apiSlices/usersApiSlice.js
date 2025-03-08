import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.0.196:4000/api/v1/user",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (userRole = "user") => `/all?userRole=${userRole}`,
      keepUnusedDataFor: 300,
      providesTags: (result, error, { userRole }) =>
        result ? [{ type: "Users", id: userRole }] : [],
    }),
    updateUser: builder.mutation({
      query: ({ id, name, email, role }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: { name, email, role },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const { useGetUsersQuery, usePrefetch } = usersApiSlice;
