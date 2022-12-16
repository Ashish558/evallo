import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constants";


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
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         }),
      }),
      getAllInvoice: builder.query({
         query: (name) => ({
            url: `api/invoice`,
            method: "GET",
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         }),
      }),

      addInvoice: builder.mutation({
         query: (body) => ({
            url: `/api/invoice `,
            method: "POST",
            body: body,
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         })
      }),
   }),
});

export const {
   useAddInvoiceMutation,
   useLazyGetParentsByNameQuery,
   useLazyGetAllInvoiceQuery
} = adminServicesApi;
