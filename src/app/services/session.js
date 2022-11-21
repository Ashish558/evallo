import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constants";


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
         }),
      }),
      submitSession: builder.mutation({
         query: (body) => ({
            url: `/api/session`,
            method: "POST",
            body: body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      updateSession: builder.mutation({
         query: (payload) => ({
            url: `/api/session/${payload.id}`,
            method: "PATCH",
            body: payload.body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      getSessions: builder.query({
         query: (url) => ({
            url: url,
            method: "GET",

         })
      }),
      getTutorStudents: builder.query({
         query: (id) => ({
            url: `/api/session/tutor/${id}`,
            method: "GET",
         }),
      }),

   }),
});

export const {
   useLazyGetTutorsByNameQuery,
   useLazyGetStudentsByNameQuery,
   useLazyGetSettingsQuery,
   useSubmitSessionMutation,
   useLazyGetUsersByNameQuery,
   useLazyGetSessionsQuery,
   useUpdateSessionMutation,
   useLazyGetTutorStudentsQuery
} = sessionServicesApi;
