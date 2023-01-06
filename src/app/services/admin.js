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
      getAllSections: builder.query({
         query: (body) => ({
            url: `/api/test/getans/${body.id}`,
            method: "GET",
            params: {userId:sessionStorage.getItem('userId') },
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
   useLazyGetAllSectionsQuery       
} = adminServicesApi;
