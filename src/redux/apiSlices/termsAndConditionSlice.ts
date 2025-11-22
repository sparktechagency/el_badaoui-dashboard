import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateTermsAndConditions: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          url: `/others/terms-and-condition`,
          method: "POST",
          body: data,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
    termsAndCondition: builder.query({
      query: (userType) => {
        const token = localStorage.getItem("token");
        return {
          url: `/others/terms-and-conditions/${userType}`,
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

export const {
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionSlice;
