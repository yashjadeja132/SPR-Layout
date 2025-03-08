import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: "userApi",
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
    getProfile: builder.query({
      query: () => `/profile`,
      keepUnusedDataFor: 300,
      providesTags: (result) =>
        result?.userProfile
          ? [{ type: "Users", id: result.userProfile.userId }]
          : [],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
      ],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, usePrefetch } =
  userApiSlice;
