import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthHeader } from "../constants/constants";

export const orgSignupApi = createApi({
    reducerPath: "orgSignupApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://testbackend.sevensquarelearning.com/'
    }),

    endpoints: (builder) => ({
        getSubscriptionsInfo: builder.query({
            query: () => ({
                url: `/Api/stripe/prices`,
                method: "GET",
                headers: getAuthHeader(),
            })
        })
    })
})

export const {
    useGetSubscriptionsInfoQuery,
    useLazyGetSubscriptionsInfoQuery,
} = orgSignupApi;