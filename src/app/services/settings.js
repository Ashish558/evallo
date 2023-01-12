import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";

export const settingsServicesApi = createApi({
   reducerPath: "settingsApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({
    
      updateSetting: builder.mutation({
         query: (body) => ({
            url: `/api/user/setting`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),
      updateOfferImage: builder.mutation({
         query: (body) => ({
            url: `/api/user/setting/addimage`,
            method: "PATCH",
            body: body,
            headers: getAuthHeader()
         })
      }),
   

   }),
});

export const {
   useUpdateSettingMutation,
   useUpdateOfferImageMutation
} = settingsServicesApi;
