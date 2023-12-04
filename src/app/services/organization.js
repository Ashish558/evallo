import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";


export const orgServicesApi = createApi({
   reducerPath: "orgApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({

      getUserByOrgName: builder.mutation({
         query: (body) => ({
            url: `/api/user/org/details`,
            method: "POST",
            body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      updateUserOrganization: builder.mutation({
         query: (body) => ({
            url: `/api/user/update/org`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader(),
         }),
      }),
      updateOrganizationDetail: builder.mutation({
         query: (body) => ({
            url: `/api/user/orgDetailUpdate`,
            method: "POST",
            body: body,
            headers: getAuthHeader(),
         }),
      }),
      updateOrgLogo: builder.mutation({
         query: (body) => ({
            url: `api/user/org/addOrgLogos/${body.id}`,
            method: "PATCH",
            body: body.formData,
            headers: getAuthHeader(),
         }),
      }),
      updateEmail: builder.mutation({
         query: (body) => ({
            url: `api/user/update/newEmail`,
            method: "POST",
            body: body,
            headers: getAuthHeader(),
         }),
      }),
      verifyNewEmail: builder.mutation({
         query: (body) => ({
            url: `api/user/confirm/newEmail/${body.userid}`,
            method: "POST",
            body,
            headers: {
               "Content-type": "application/json",
            },
         }),

      }),
   }),
});

export const {
   useUpdateEmailMutation,
   useVerifyNewEmailMutation,
   useUpdateOrganizationDetailMutation,
   useGetUserByOrgNameMutation,
   useUpdateUserOrganizationMutation,
   useUpdateOrgLogoMutation,
} = orgServicesApi;
