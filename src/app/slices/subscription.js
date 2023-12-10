import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeSubscriptionName: "",
}

const subscription = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        updateActiveSubscriptionName: (state, { payload }) => {
            state.activeSubscriptionName = payload;
        },
    }
});

export const {
    updateActiveSubscriptionName
} = subscription.actions;
export default subscription.reducer;