import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

// Clean base query (No refresh token logic)
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    // baseUrl: "http://10.10.7.54:4000/api/v1",
    baseUrl: "https://sohag500.binarybards.online/api/v1",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });

  // Make the original request
  const result = await baseQuery(args, api, extraOptions);

  // If token expired or unauthorized → redirect to login
  if (result.error?.status === 401) {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    toast.error("Session expired, please login again.");
    window.location.replace("/auth/login");
  }

  return result;
};

// Create API
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Banner",
    "AdminData",
    "SubCategories",
    "Category",
    "Projects",
    "AvailableTimes",
    "ProjectManagement",
    "Users",
    "Appointments",
  ],
  endpoints: () => ({}),
});

// Base image URL
// export const imageUrl = "http://10.10.7.54:4000";
export const imageUrl = "https://sohag500.binarybards.online";
