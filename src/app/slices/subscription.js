import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
}

const subscription = createSlice({
    name: "subscription",
    initialState,
    reducers: {
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
    }
});

export const {
    updateActiveSubscriptionName,
    updateActiveSubscriptionInfo,
    updateActiveExtensionInfo,
    updateSubscriptionsInfoFromAPI,
} = subscription.actions;
export default subscription.reducer;