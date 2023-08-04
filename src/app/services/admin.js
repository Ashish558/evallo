import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";


export const adminServicesApi = createApi({
   reducerPath: "adminApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({

      getParentsByName: builder.query({
         query: (name) => ({
            url: `api/user/parent`,
            params: {
               search: name
            },
            method: "GET",
            headers: getAuthHeader()
         }),
      }),
      getAllInvoice: builder.query({
         query: (name) => ({
            url: `api/invoice`,
            method: "GET",
            headers: getAuthHeader()
         }),
      }),

      addInvoice: builder.mutation({
         query: (body) => ({
            url: `/api/invoice `,
            method: "POST",
            body: body,
            headers: getAuthHeader()
         })
      }),
      editInvoice: builder.mutation({
         query: (body) => ({
            url: `/api/invoice/${body._id}`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),

      blockUser: builder.mutation({
         query: (body) => ({
            url: `/api/user/block/${body.id}`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),

      unblockUser: builder.mutation({
         query: (body) => ({
            url: `/api/user/unblock/${body.id}`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),
      deleteUser: builder.mutation({
         query: (id) => ({
            url: `/api/user/${id}`,
            method: "DELETE",
            headers: getAuthHeader()
         })
      }),
      getAllSections: builder.query({
         query: (body) => ({
            url: `/api/test/getans/${body.id}`,
            method: "GET",
            params: {userId:sessionStorage.getItem('userId') },
            headers: getAuthHeader()
         })
      }),
      getAllAssignedtutors: builder.query({
         query: (body) => ({
            url: `/api/user/tutors/all`,
            method: "GET",
            headers: getAuthHeader()
         })
      }),
      addAssignedTutor: builder.mutation({
         query: (body) => ({
            url: `/api/user/add/AssignedTutors`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),
      deleteAssignedTutor: builder.mutation({
         query: (body) => ({
            url: `/api/user/removeTutor/${body.studentId}/${body.tutorId}`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),
      addNewQuestion: builder.mutation({
         query: (body) => ({
            url: `/api/user/addNewField`,
            method: "POST",
            body: body,
            headers: getAuthHeader()
         })
      }),
   }),
});

export const {
   useAddInvoiceMutation,
   useLazyGetParentsByNameQuery,
   useLazyGetAllInvoiceQuery,
   useBlockUserMutation,
   useUnblockUserMutation,
   useLazyGetAllSectionsQuery,
   useDeleteUserMutation,
   useEditInvoiceMutation,
   useLazyGetAllAssignedtutorsQuery,
   useAddAssignedTutorMutation,
   useDeleteAssignedTutorMutation,
   useAddNewQuestionMutation
} = adminServicesApi;
