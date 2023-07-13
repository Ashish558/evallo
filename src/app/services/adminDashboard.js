import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";

export const adminDashboardServicesApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({
    getSpecificActionLog: builder.query({
      query: () => ({
        url: `/api/user/admin/getSpecificActionLog`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getLatestSignUp: builder.query({
      query: () => ({
        url: `/api/user/superadmin/getlastSignUpdetails`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
  }),
});

export const { useGetSpecificActionLogQuery, useGetLatestSignUpQuery } =
  adminDashboardServicesApi;
