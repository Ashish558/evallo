import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";

export const settingsServicesApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({
    getAllPermission: builder.query({
      query: () => ({
        url: `api/user/admin/getAllPermission`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    updateSetting: builder.mutation({
      query: (body) => ({
        url: `/api/user/setting`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    updateOrgSetting: builder.mutation({
      query: (body) => ({
        url: `/api/user/orgSettings`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    updateOfferImage: builder.mutation({
      query: (body) => ({
        url: `/api/user/setting/addimage`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),

    updatePermission: builder.mutation({
      query: (body) => ({
        url: `/api/user/admin/setPermission`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    addPermission: builder.mutation({
      query: (body) => ({
        url: `/api/user/superadmin/addPermission`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    deletePermission: builder.mutation({
      query: (body) => ({
        url: `/api/user/superadmin/addPermission`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    deleteAllPermission: builder.mutation({
      query: (body) => ({
        url: `/api/user/admin/deleteAllPermissions`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    studentFeedback: builder.mutation({
      query: (body) => ({
        url: `/api/feedback/feedback`,
        method: "POST",
        body: body,
        headers: {...getAuthHeader(), "content-type":"application/json"},
      }),
    }),
  }),
});

export const {
  useUpdateSettingMutation,
  useStudentFeedbackMutation,
  useUpdateOfferImageMutation,
  useUpdateOrgSettingMutation,
  useGetAllPermissionQuery,
  useUpdatePermissionMutation,
  useAddPermissionMutation,
  useDeletePermissionMutation,
  useDeleteAllPermissionMutation,
} = settingsServicesApi;
