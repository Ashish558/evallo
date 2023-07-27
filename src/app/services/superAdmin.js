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
    getLogout: builder.query({
      query: (name) => ({
        url: `api/user/org/logOut`,
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
    getFinancialStats: builder.query({
      query: (name) => ({
        url: `api/user/superadmin/financialStats`,
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
    getActionLog: builder.query({
      query: (name) => ({
        url: `/api/user/superadmin/actionlog`,
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
    getLatestOrg: builder.query({
      query: () => ({
        url: `/api/user/superadmin/getlastSignUpdetails`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getAllOrg: builder.query({
      query: () => ({
        url: `/api/user/superadmin/getAllOrg`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getSpecificActionLog: builder.mutation({
      query: (body) => ({
        url: `/api/user/superadmin/getSpecificActionLog`,
        method: "POST",
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
  useGetActionLogQuery,
  useLazyGetAllOrgQuery,
  useLazyGetLatestOrgQuery,
  useLazyGetLogoutQuery,
  useGetFinancialStatsQuery,
  useGetSpecificActionLogMutation
  
} = superAdminServicesApi;
