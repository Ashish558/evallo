import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constants";


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

   }),
});

export const {
  useGetUserByOrgNameMutation
} = orgServicesApi;
