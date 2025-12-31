import { api } from "../api/baseApi";

interface ProjectQueryArgs {
  status?: "NEW" | "COMPLETED" | "ACCEPTED";
  searchTerm?: string;
  page?: number;
  limit?: number;
}

interface UpdateProjectArgs {
  id: string;
  status?: "NEW" | "COMPLETED" | "ACCEPTED";
  totalWithoutVat?: number;
  totalWithVat?: number;
  artisanId?: string;
}

const projectManagementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    projectManagement: builder.query({
      query: (args?: ProjectQueryArgs) => {
        const params = new URLSearchParams();
        
        if (args) {
          if (args.status) params.append("status", args.status);
          if (args.searchTerm) params.append("searchTerm", args.searchTerm);
          if (args.page) params.append("page", args.page.toString());
          if (args.limit) params.append("limit", args.limit.toString());
        }

        return {
          method: "GET",
          url: "/admin/projects",
          params,
        };
      },
      providesTags: ["ProjectManagement"],
    }),
    
    singleProjectManagement: builder.query({
      query: (id: string) => ({
        method: "GET",
        url: `/admin/projects/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "ProjectManagement", id }],
    }),
    
    updateProjectManagement: builder.mutation<any, UpdateProjectArgs>({
      query: ({ id, ...data }) => ({
        method: "PATCH",
        url: `/admin/projects/${id}`,
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "ProjectManagement",
        { type: "ProjectManagement", id },
      ],
    }),

    getAllArtisan: builder.query({
      query: () => ({
        method: "GET",
        url: "/admin/all-artisan",
      }),
      providesTags: ["ProjectManagement"],
    }),
  }),
});

export const {
  useProjectManagementQuery,
  useSingleProjectManagementQuery,
  useUpdateProjectManagementMutation,
  useGetAllArtisanQuery,
} = projectManagementApi;