import { api } from "../api/baseApi";

interface LoginData {
  email: string;
  password: string;
}

interface OtpVerifyData {
  email: string;
  oneTimeCode: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface UpdateProfileData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation<any, OtpVerifyData>({
      query: (data) => {
        return {
          method: "POST",
          url: "auth/verify-email",
          body: data,
        };
      },
    }),
    login: builder.mutation<any, LoginData>({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data: any) => {
        return data;
      },
      transformErrorResponse: (baseQueryReturnValue: any) => {
        const { data } = baseQueryReturnValue;
        const { message } = data || {};
        return message || "An error occurred";
      },
    }),
    forgotPassword: builder.mutation<any, ForgotPasswordData>({
      query: (data) => {
        return {
          method: "POST",
          url: "auth/forget-password",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation<any, ResetPasswordData>({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: data,
          headers: {
            Authorization: localStorage.getItem("Authorization") || "",
          },
        };
      },
    }),

    changePassword: builder.mutation<any, ChangePasswordData>({
      query: (value) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: value,
        };
      },
      invalidatesTags: ["AdminData"],
    }),

    updateProfile: builder.mutation<any, UpdateProfileData>({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          method: "POST",
          url: "/auth/update-profile",
          body: data,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      invalidatesTags: ["AdminData"],
    }),
    updateAdminProfile: builder.mutation<any, UpdateProfileData>({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          method: "PATCH",
          url: "/admin/profile",
          body: data,
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      invalidatesTags: ["AdminData"],
    }),

    profile: builder.query<any, void>({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          method: "GET",
          url: "/auth/get-profile",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      providesTags: ["AdminData"],

      transformResponse: ({ user }: { user: any }) => {
        return user;
      },
    }),
    fetchAdminProfile: builder.query<any, void>({
      query: () => {
        return {
          method: "GET",
          url: "/admin/profile",
        };
      },
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
  useUpdateAdminProfileMutation,
  useFetchAdminProfileQuery,
} = authSlice;
