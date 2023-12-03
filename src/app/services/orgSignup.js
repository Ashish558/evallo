import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";

export const orgSignupApi = createApi({
    reducerPath: "orgSignupApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        mode: "cors",
        credentials: "include",
    }),

    endpoints: (builder) => ({
        getSubscriptionsInfo: builder.query({
            query: () => ({
                url: `/api/stripe/prices`,
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