import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";


export const testServicesApi = createApi({
   reducerPath: "testsApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({
      getTestsByName: builder.query({
         query: (name) => ({
            url: `api/test/`,
            params: {
               search: name
            },
            method: "GET",
            headers: getAuthHeader()
         }),
      }),

      addTest: builder.mutation({
         query: (body) => ({
            url: `/api/test`,
            method: "POST",
            body: body,
            headers: getAuthHeader()
         })
      }),
      getTestDetails: builder.query({
         query: (id) => ({
            url: `/api/test/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      assignTest: builder.mutation({
         query: (body) => ({
            url: `/api/test/assigntest`,
            method: "POST",
            body: body,
            headers: getAuthHeader()
         })
      }),
      addPdf: builder.mutation({
         query: (body) => ({
            url: `/api/test/addpdf/${body.id}`,
            method: "POST",
            body: body.formData,
            headers: getAuthHeader()
         })
      }),
      attendTest: builder.mutation({
         query: (body) => ({
            url: `/api/test/attendtest/${body.id}`,
            method: "POST",
            body: body.reqbody,
            headers: getAuthHeader()
         })
      }),
      updateTime: builder.mutation({
         query: (body) => ({
            url: `/api/test/updatetime/${body.id}`,
            method: "POST",
            body: body.reqbody,
            headers: getAuthHeader()
         })
      }),
      getSections: builder.query({
         query: (body) => ({
            url: `/api/test/getsections/${body.id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getAssignedTest: builder.query({
         query: (id) => ({
            url: `/api/test/assigntest`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getAllAssignedTest: builder.query({
         query: (id) => ({
            url: `/api/test/all/assigntest`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),

      getTime: builder.query({
         query: (id) => ({
            url: `/api/test/gettime/${id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      startTest: builder.mutation({
         query: (body) => ({
            url: `/api/test/start/${body.id}`,
            method: "POST",
            body: body.reqbody,
            headers: getAuthHeader()
         })
      }),
      continueTest: builder.query({
         query: (body) => ({
            url: `/api/test/continuetest/${body.id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      getTestResponse: builder.query({
         query: (body) => ({
            url: `/api/test/getresponse/${body.id}`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      submitTest: builder.mutation({
         query: (body) => ({
            url: `/api/test/submit/${body.submitId}`,
            method: "POST",
            body: body.reqbody,
            headers: getAuthHeader()
         })
      }),

   }),
});

export const {
   useLazyGetTestsByNameQuery,
   useAssignTestMutation,
   useAddTestMutation,
   useAddPdfMutation,
   useAttendTestMutation,
   useUpdateTimeMutation,
   useLazyGetAssignedTestQuery,
   useLazyGetTimeQuery,
   useLazyGetTestDetailsQuery,
   useLazyGetSectionsQuery,
   useStartTestMutation,
   useLazyContinueTestQuery,
   useSubmitTestMutation,
   useLazyGetTestResponseQuery,
   useLazyGetAllAssignedTestQuery
} = testServicesApi;
