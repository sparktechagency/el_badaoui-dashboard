import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: `/notification`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
    read: builder.mutation({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: `/notifications`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
  }),
});

export const { useNotificationQuery, useReadMutation } = notificationSlice;
