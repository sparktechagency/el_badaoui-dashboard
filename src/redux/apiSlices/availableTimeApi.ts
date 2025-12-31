import { api } from "../api/baseApi";

const availableTimeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableTimes: builder.query({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: `/adminsettings/working-hours`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      providesTags: ["AvailableTimes"],
    }),

    updateAvailableTime: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          url: `/adminsettings/working-hours`,
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
          body: data,
        };
      },
      invalidatesTags: ["AvailableTimes"],
    }),
  }),
});

export const { useGetAvailableTimesQuery, useUpdateAvailableTimeMutation } =
  availableTimeSlice;
