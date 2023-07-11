import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";

export const superAdminServicesApi = createApi({
  reducerPath: "superAdminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  //
  endpoints: (builder) => ({
    getAllOrgStats: builder.query({
      query: (name) => ({
        url: `api/user/superadmin/dashboard/orgstats`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),

    getUserStatsByRole: builder.query({
      query: (body) => ({
        url: `api/user/superadmin/dashboard/userstats?role=${body.role}`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getAllTest: builder.query({
      query: (name) => ({
        url: `api/user/superadmin/getAllTest`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getUserDailyActivity: builder.query({
      query: (name) => ({
        url: `api/user/superAdmin/userDailyActivity`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),

    addUserDemography: builder.mutation({
      query: (body) => ({
        url: `/api/user/superadmin/dashboard/userdemography`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    editSuperInvoice: builder.mutation({
      query: (body) => ({
        url: `/api/invoice/${body._id}`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
  }),
});

export const {
  useGetAllOrgStatsQuery,
  useGetAllTestQuery,
  useGetUserStatsByRoleQuery,
  useGetUserDailyActivityQuery,
  useAddUserDemographyMutation,
} = superAdminServicesApi;
