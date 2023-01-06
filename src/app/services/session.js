import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {  BASE_URL, getAuthHeader } from "../constants/constants";


export const sessionServicesApi = createApi({
   reducerPath: "sessionApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({
      getTutorsByName: builder.query({
         query: (name) => ({
            url: `api/user/tutor`,
            params: {
               search: name
            },
            method: "GET",
         }),
      }),
      getStudentsByName: builder.query({
         query: (name) => ({
            url: `api/user/student`,
            params: {
               search: name
            },
            method: "GET",
         }),
      }),
      getTutorStudentsByName: builder.query({
         query: (name) => ({
            url: `api/user/mystudents`,
            method: "GET",
            params: {
               search: name
            },
            headers: {
               "Authorization": localStorage.getItem('token'),
            },
         }),
      }),
      getUsersByName: builder.query({
         query: (name) => ({
            url: `api/user`,
            params: {
               search: name
            },
            method: "GET",
         }),
      }),
      getSettings: builder.query({
         query: (name) => ({
            url: `/api/user/setting`,
            params: {
               search: name
            },
            method: "GET",
            headers: getAuthHeader()
         }),
      }),
      submitSession: builder.mutation({
         query: (body) => ({
            url: `/api/session`,
            method: "POST",
            body: body,
            headers: {
               "Authorization": localStorage.getItem('token'),
            },
         })
      }),
      updateSession: builder.mutation({
         query: (payload) => ({
            url: `/api/session/${payload.id}`,
            method: "PATCH",
            body: payload.body,
            headers: {
               "Authorization": localStorage.getItem('token'),
            },
         })
      }),
      updateSessionStatus: builder.query({
         query: (id) => ({
            url: `/api/session/sessioncompleted/${id}`,
            method: "GET",
         })
      }),
      getSessions: builder.query({
         query: (url) => ({
            url: url,
            method: "GET",
         })
      }),
      getSingleSession: builder.query({
         query: (id) => ({
            url: `/api/session/${id}`,
            method: "GET",
         })
      }),
      getTutorStudents: builder.query({
         query: (id) => ({
            url: `/api/session/tutor/${id}`,
            method: "GET",
         }),
      }),
      submitFeedback: builder.mutation({
         query: (body) => ({
            url: `/api/feedback`,
            method: "POST",
            body: body,
            headers: {
               "Authorization": localStorage.getItem('token'),
            },
         })
      }),

   }),
});

export const {
   useLazyGetTutorsByNameQuery,
   useLazyGetStudentsByNameQuery,
   useLazyGetTutorStudentsByNameQuery,
   useLazyGetSettingsQuery,
   useSubmitSessionMutation,
   useLazyGetUsersByNameQuery,
   useLazyGetSessionsQuery,
   useLazyGetSingleSessionQuery,
   useUpdateSessionMutation,
   useLazyGetTutorStudentsQuery,
   useLazyUpdateSessionStatusQuery,
   useSubmitFeedbackMutation
} = sessionServicesApi;
