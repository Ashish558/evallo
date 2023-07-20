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
    getTutorPerformance: builder.query({
      query: () => ({
        url: `/api/user/admin/getTutorPerformance`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getPopularServices: builder.query({
      query: () => ({
        url: `api/user/admin/getPopularServices`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getUserStats: builder.query({
      query: () => ({
        url: `api/user/admin/dashboard/userstats`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getAllRevenue: builder.mutation({
      query: (body) => ({
        url: `api/session/org/allRevenuesessions`,
        method: "POST",
        body: body,

        headers: getAuthHeader(),
      }),
    }),
    getLeakedRevenue: builder.mutation({
      query: (body) => ({
        url: `api/session/org/leakedRevenuesessions`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    getImpendingRevenue: builder.mutation({
      query: (body) => ({
        url: `api/session/org/impendingRevenuesessions`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
  }),
});

export const {
  useGetSpecificActionLogQuery,
  useGetLatestSignUpQuery,
  useGetUserStatsQuery,
  useGetImpendingRevenueMutation,
  useGetLeakedRevenueMutation,
  useGetAllRevenueMutation,
  useLazyGetTutorPerformanceQuery,
  useLazyGetPopularServicesQuery,
} = adminDashboardServicesApi;
