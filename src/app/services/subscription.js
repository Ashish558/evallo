import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";
export const subscriptionApi = createApi({
    reducerPath: "subscriptionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
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
        applyCoupon: builder.query({
            query: (body) => ({
                url: `api/stripe/applyCoupon?couponName=${body.couponName}&subscriptionPrice=${body.subscriptionPrice}`,
                method: 'GET',
                headers: getAuthHeader()
            })
        })
    })
})

export const {
    useAddSubscriptionsMutation,
    useCreateIntentMutation,
    useFinishSetupMutation,
    useApplyCouponQuery,
    useLazyApplyCouponQuery,
} = subscriptionApi;