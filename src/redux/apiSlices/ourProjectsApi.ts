import { api } from "../api/baseApi";

const ourProjectsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOurProjects: builder.query({
      query: (args) => {
        const params: Record<string, string> = {};

        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params[arg.name] = arg.value;
          });
        }

        const token = localStorage.getItem("token");

        return {
          url: `/previousproject`,
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
          params,
        };
      },
      providesTags: ["Projects"],
    }),

    createPreviousProject: builder.mutation({
      query: (formData) => {
        const token = localStorage.getItem("token");
        return {
          url: `/previousproject`,
          method: "POST",
          body: formData,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      invalidatesTags: ["Projects"],
    }),

    updatePreviousProject: builder.mutation({
      query: ({ id, formData }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/previousproject/${id}`,
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      invalidatesTags: ["Projects"],
    }),

    deletePreviousProject: builder.mutation({
      query: (id) => {
        const token = localStorage.getItem("token");
        return {
          url: `/previousproject/${id}`,
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetAllOurProjectsQuery,
  useCreatePreviousProjectMutation,
  useUpdatePreviousProjectMutation,
  useDeletePreviousProjectMutation,
} = ourProjectsSlice;