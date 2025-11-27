import { api } from "../api/baseApi";

const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    admin: builder.query({
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
        };
      },
    }),
    users: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user",
        };
      },
    }),
    vendors: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user?role=VENDOR",
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
  }),
});

export const {
  useAdminQuery,
  useUsersQuery,
  useVendorsQuery,
  useUserByIdQuery,
} = userSlice;