import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketApiSlice = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.0.196:4000/api/v1/ticket",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
    getTicket: builder.query({
      // To fetch a specific ticket by its ticketId
      query: (ticketId) => `/${ticketId}`,
      keepUnusedDataFor: 300,
      providesTags: (result, error, ticketId) => [
        { type: "Tickets", id: ticketId },
      ],
    }),
    getAllTickets: builder.query({
      // To fetch all tickets (no request body for GET)
      query: () => `/`,
    }),
    createTicket: builder.mutation({
      // To create a new ticket
      query: (data) => ({
        url: `/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Tickets", id: "LIST" }],
    }),
    updateTicket: builder.mutation({
      // To update an existing ticket using data.ticketId
      query: (data) => ({
        url: `/${data.ticketId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Tickets", id: arg.ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    deleteTicket: builder.mutation({
      // To delete an existing ticket using data.ticketId
      query: (data) => ({
        url: `/${data.ticketId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Tickets", id: arg.ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTicketQuery,
  useGetAllTicketsQuery,
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useUpdateTicketMutation,
} = ticketApiSlice;
