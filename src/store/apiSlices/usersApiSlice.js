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
    }),
    // getDashboardData: builder.query({
    //   query: (newUser) => ({
    //     url: "/",
    //     method: "GET",
    //     body: newUser,
    //   }),
    //   invalidatesTags: [{ type: "Users", id: "LIST" }],
    // }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, name, email }) => ({
        url: `/${userId}`,
        method: "PUT",
        body: { name, email },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  // useGetDashboardDataQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
