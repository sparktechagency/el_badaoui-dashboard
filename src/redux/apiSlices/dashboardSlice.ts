import { api } from "../api/baseApi";

const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    generalStats: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/analytics/overview",
        };
      },
      providesTags: ["AdminData"],
    }),
    projectStatusFunnel: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/analytics/project-status`,
        };
      },
      providesTags: ["AdminData"],
    }),

    recentProject: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/analytics/recent-project",
        };
      },
      providesTags: ["AdminData"],
    }),

    totalEstimates: builder.query({
      query: ({year}) => {
        return {
          method: "GET",
          url: `/analytics/total-estimates?year=${year}`,
        };
      },
      providesTags: ["AdminData"],
    }),
  }),
});

export const {
  useGeneralStatsQuery,
  useProjectStatusFunnelQuery,
  useRecentProjectQuery,
  useTotalEstimatesQuery,
} = dashboardSlice;