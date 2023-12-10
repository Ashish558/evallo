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
    subscriptionUpdateTrigger: null
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
            console.log("payload in updatePaymentMethods");
            console.log(payload);
            state.paymentMethods = payload;
        },
        triggerSubscriptionUpdate: (state) => {
            state.subscriptionUpdateTrigger = {};
        }
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
} = subscription.actions;
export default subscription.reducer;