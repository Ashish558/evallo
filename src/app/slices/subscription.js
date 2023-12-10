import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stripeCustomerId: "",
    subscriptionsInfoFromAPI: null,
    activeSubscriptionName: "",
    activeSubscriptionInfo: {
        planName: "",
        planDisplayName: "",
        activeTutorsAllowed: "",
        currency: "",
        subscriptionPricePerMonth: 0,
        monthlyCostAfterDiscount: 0,
        startDate: null,
        autoRenewalDate: null,
        expiryDate: null,
        freeTrialExpiryDate: null,
        hasExpired: false,
        isCancelled: false,
        priceObject: null,
        subscriptionId: ""
    },
    activeExtensionInfo: {
        planName: "",
        planDisplayName: "",
        packageName: "",
        productQuantity: 0,
        currency: "",
        subscriptionPricePerMonth: 0,
        monthlyCostAfterDiscount: 0,
        startDate: null,
        autoRenewalDate: null,
        expiryDate: null,
        freeTrialExpiryDate: null,
        hasExpired: false,
        isCancelled: false,
        priceObject: null,
        subscriptionId: ""
    },
    paymentMethods: [],
    subscriptionUpdateTrigger: null,
    hasSubscriptionExpired: false,
    defaultPaymentMethodId: "",
}

const subscription = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        updateStripeCustomerId: (state, { payload }) => {
            state.stripeCustomerId = payload;
        },
        updateActiveSubscriptionName: (state, { payload }) => {
            state.activeSubscriptionName = payload;
        },
        updateActiveSubscriptionInfo: (state, { payload }) => {
            state.activeSubscriptionInfo = payload;
        },
        updateActiveExtensionInfo: (state, { payload }) => {
            state.activeExtensionInfo = payload;
        },
        updateSubscriptionsInfoFromAPI: (state, { payload }) => {
            state.subscriptionsInfoFromAPI = payload;
        },
        updatePaymentMethods: (state, { payload }) => {
            state.paymentMethods = payload;
        },
        triggerSubscriptionUpdate: (state) => {
            state.subscriptionUpdateTrigger = {};
        },
        updateHasSubscriptionExpired: (state, { payload }) => {
            state.hasSubscriptionExpired = payload;
        },
        updateDefaultPaymentMethodId: (state, { payload }) => {
            state.defaultPaymentMethodId = payload;
        },
    }
});

export const {
    updateStripeCustomerId,
    updateActiveSubscriptionName,
    updateActiveSubscriptionInfo,
    updateActiveExtensionInfo,
    updateSubscriptionsInfoFromAPI,
    updatePaymentMethods,
    triggerSubscriptionUpdate,
    updateHasSubscriptionExpired,
    updateDefaultPaymentMethodId,
} = subscription.actions;
export default subscription.reducer;