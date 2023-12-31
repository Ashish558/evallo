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
            headers: getAuthHeader()
         }),
      }),
      getStudentsByName: builder.query({
         query: (name) => ({
            url: `api/user/student`,
            params: {
               search: name
            },
            method: "GET",
            headers: getAuthHeader()
         }),
      }),
      getSessionNotes: builder.query({
         query: (id) => ({
            url: `api/session/student/getAllSessionNotes/${id}`,
         
            method: "GET",
            headers: getAuthHeader()
         }),
      }),
      getTutorStudentsByName: builder.query({
         query: (name) => ({
            url: `api/user/mystudents`,
            method: "GET",
            params: {
               search: name
            },
            headers: getAuthHeader()
         }),
      }),
      getUsersByName: builder.query({
         query: (name) => ({
            url: `api/user`,
            params: {
               search: name
            },
            method: "GET",
            headers: getAuthHeader()
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
            headers: getAuthHeader()
         })
      }),
      getSession: builder.query({
         query: (body) => ({
            url: `/api/session`,
            method: "GET",
     
            headers: getAuthHeader()
         })
      }),
      updateSession: builder.mutation({
         query: (payload) => ({
            url: `/api/session/${payload.id}`,
            method: "PATCH",
            body: payload.body,
            headers: getAuthHeader()
         })
      }),
      getTotalHours: builder.query({
         query: (payload) => ({
            url: `/api/session/student/getTotalHoursTutored/${payload}`,
            method: "GET",
           
            headers: getAuthHeader()
         })
      }),
      updateAllSession: builder.mutation({
         query: (payload) => ({
            url: `/api/session/all/${payload.id}`,
            method: "PATCH",
            body: payload.body,
            headers: getAuthHeader()
         })
      }),
      updateSessionStatus: builder.query({
         query: (id) => ({
            url: `/api/session/sessioncompleted/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getSessions: builder.query({
         query: (url) => ({
            url: url,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getSingleSession: builder.query({
         query: (id) => ({
            url: `/api/session/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getCompletedSessions: builder.query({
         query: (id) => ({
            url: `/api/session/completedSessions/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getTutorStudents: builder.query({
         query: (id) => ({
            url: `/api/session/tutor/${id}`,
            method: "GET",
            headers: getAuthHeader()
         }),
      }),
      submitFeedback: builder.mutation({
         query: (body) => ({
            url: `/api/feedback`,
            method: "POST",
            body: body,
            headers: getAuthHeader()
         })
      }),
      getSessionFeedback: builder.query({
         query: (id) => ({
            url: `/api/feedback/session/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      
      getStudentFeedback: builder.query({
         query: (body) => ({
            url: `/api/feedback/student/${body.id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      updateFeedback: builder.mutation({
         query: (body) => ({
            url: `/api/feedback/update/${body.id}`,
            body,
            method: "PATCH",
            headers: getAuthHeader()
         })
      }),
      sessionMissed: builder.query({
         query: (id) => ({
            url: `/api/session/sessionmissed/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      cancelSession: builder.query({
         query: (id) => ({
            url: `/api/session/sessioncancel/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      deleteSession: builder.mutation({
         query: (id) => ({
            url: `/api/session/${id}`,
            method: "DELETE",
            headers: getAuthHeader()
         })
      }),
      deleteAllRecurringSession: builder.mutation({
         query: (id) => ({
            url: `/api/session/all/${id}`,
            method: "DELETE",
            headers: getAuthHeader()
         })
      }),

   }),
});

export const {
   useLazyGetSessionQuery,
   useLazyGetTutorsByNameQuery,
   useLazyGetStudentsByNameQuery,
   useLazyGetTutorStudentsByNameQuery,
   useLazyGetSettingsQuery,
   useLazyGetSessionNotesQuery,
   useSubmitSessionMutation,
   useLazyGetUsersByNameQuery,
   useLazyGetTotalHoursQuery,
   useLazyGetCompletedSessionsQuery,
   useLazyGetSessionsQuery,
   useLazyGetSingleSessionQuery,
   useUpdateSessionMutation,
   useLazyGetTutorStudentsQuery,
   useLazyUpdateSessionStatusQuery,
   useSubmitFeedbackMutation,
   useLazyGetSessionFeedbackQuery,
   useLazyGetStudentFeedbackQuery,
   useLazyCancelSessionQuery,
   useLazySessionMissedQuery,
   useDeleteSessionMutation,
   useDeleteAllRecurringSessionMutation,
   useUpdateAllSessionMutation,
   useUpdateFeedbackMutation
} = sessionServicesApi;
