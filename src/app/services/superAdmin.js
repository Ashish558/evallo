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
    getAllOrgStatsRange: builder.mutation({
      query: (body) => ({
        url: `api/user/superadmin/dashboard/orgstats`,
        method: "POST",
        body,
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
    getUserStatsByRoleRange :builder.mutation({
      query: (body) => ({
        url: `api/user/superadmin/dashboard/userstats?role=${body.role}`,
        method: "POST",
        body,
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
    getFinancialStatsRange: builder.mutation({
      query: (body) => ({
        url: `api/user/superadmin/financialStats`,
        method: "POST",
        body,
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
    getUserDailyActivityRange: builder.mutation({
      query: (body) => ({
        url: `api/user/superAdmin/userDailyActivity`,
        method: "POST",
        body,
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
    getActionLogRange:builder.mutation({
      query: (body) => ({
        url: `/api/user/superadmin/actionlog`,
        method: "POST",
        body,
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
    getAdminPortalToken: builder.query({
      query: (body) => ({
        url: `/api/user/superadmin/getOrgToken/${body.id}`,
        method: "GET",
       
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
    getLatestOrgRange:builder.mutation({
      query: (body) => ({
        url: `/api/user/superadmin/getlastSignUpdetails`,
        method: "POST",
        body,
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
    getTotalHours: builder.mutation({
      query: (body) => ({
        url: `api/user/superadmin/totalHours`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    addManager2: builder.mutation({
      query: (body) => ({
        url: `api/user/registerManager`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    deleteAdmin: builder.mutation({
      query: (body) => ({
        url: `api/user/superAdmin/deleteOrg`,
        method: "DELETE",
        body,
        headers: getAuthHeader(),
      }),
    }),
    deleteManager: builder.mutation({
      query: (body) => ({
        url: `api/user/superAdmin/deleteManager`,
        method: "DELETE",
        body,
        headers: getAuthHeader(),
      }),
    }),
  }),
});

export const {
  useGetAllOrgStatsQuery,
  useGetAllOrgStatsRangeMutation,
  useGetAllTestQuery,
  useDeleteManagerMutation,
  useDeleteAdminMutation, 
  useAddManager2Mutation,
  useGetUserStatsByRoleQuery,
  useGetUserStatsByRoleRangeMutation,
  useGetUserDailyActivityQuery,
  useGetUserDailyActivityRangeMutation,
  useAddUserDemographyMutation,
  useGetActionLogQuery,
  useGetActionLogRangeMutation,
  useLazyGetAllOrgQuery,
  useGetTotalHoursMutation,
  useLazyGetLatestOrgQuery,
  useGetLatestOrgRangeMutation,
  useLazyGetLogoutQuery,
  useGetFinancialStatsQuery,
  useGetFinancialStatsRangeMutation,
useLazyGetAdminPortalTokenQuery,
  useGetSpecificActionLogMutation
  
} = superAdminServicesApi;
