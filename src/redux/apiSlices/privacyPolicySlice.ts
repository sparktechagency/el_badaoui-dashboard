import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePricyPolicy: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          url: `/others/privacy-policy`,
          method: "POST",
          body: data,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
    privacyPolicy: builder.query({
      query: (userType) => {
        const token = localStorage.getItem("token");
        return {
          url: `/others/privacy-policy/${userType}`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),
  }),
});

export const { useUpdatePricyPolicyMutation, usePrivacyPolicyQuery } =
  privacyPolicySlice;
