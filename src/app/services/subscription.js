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
        }),
        cancelSubscription: builder.mutation({
            query: (subscriptionId) => ({
                url: `api/stripe/cancel/${subscriptionId}`,
                method: "DELETE",
                header: getAuthHeader(),
            })
        }),
        changeSubscriptions: builder.mutation({
            query: (body) => ({
                url: `api/stripe/changeplan`,
                method: "POST",
                body: body,
                headers: getAuthHeader()
            })
        }),
        enableAutoRenewal: builder.mutation({
            query: (body) => ({
                url: `api/stripe/enable-auto-renew`,
                method: "POST",
                body: body,
                headers: getAuthHeader()
            })
        }),
        renewProduct: builder.mutation({
            query: (body) => ({
                url: `api/stripe/renew`,
                method: "POST",
                body: body,
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
    useCancelSubscriptionMutation,
    useChangeSubscriptionsMutation,
    useEnableAutoRenewalMutation,
    useRenewProductMutation,
} = subscriptionApi;