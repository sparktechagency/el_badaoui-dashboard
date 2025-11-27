import { api } from "../api/baseApi";

const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if(args) {
           args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/admin/users",
          params,
        };
      },
    }),
    userStatusUpdate: builder.mutation({
      query: ({id, status}) => {
        return {
          method: "PATCH",
          url: `/admin/users/${id}/status`,
          body: { status }, // Only send status in body, id is in URL
        };
      },
    }),
    createArtisans: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/user",
          body: data,
        };
      },
    }),
    updateArtisanInfo: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          method: "PATCH",
          url: `/admin/artisan/${id}`,
          body: data,
        };
      },
    }),
    userById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/user/profile/${id}`,
        };
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/admin/users/${id}`,
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUserStatusUpdateMutation,
  useCreateArtisansMutation,
  useUpdateArtisanInfoMutation,
  useUserByIdQuery,
  useDeleteUserMutation,
} = userSlice;