import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthHeader } from "../constants/constants";

export const subscriptionApi = createApi({
    reducerPath: "subscriptionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://testbackend.sevensquarelearning.com/'
    }),

    endpoints: (builder) => ({
        addSubscriptions: builder.mutation({
            query: (body) => ({
                url: `api/stripe/add_subscriptions`,
                method: "POST",
                body: body,
                headers: getAuthHeader(),
            })
        }),
        createIntent: builder.mutation({
            query: (body) => ({
                url: `/api/stripe/create-intent`,
                method: "POST",
                body: body,
                headers: getAuthHeader(),
            })
        }),
        finishSetup: builder.mutation({
            query: (body) => ({
                url: `/api/stripe/finish_setup`,
                method: "POST",
                body: body,
                headers: getAuthHeader(),
            })
        }),
    })
})

export const {
    useAddSubscriptionsMutation,
    useCreateIntentMutation,
    useFinishSetupMutation,
} = subscriptionApi;