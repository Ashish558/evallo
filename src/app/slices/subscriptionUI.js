import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isActive: false,
    isInUpdateMode: false,
    openSubscriptionPanel: false,
    openExtensionsPanel: false,
}

const subscriptionUI = createSlice({
    name: "subscriptionUI",
    initialState,
    reducers: {
        openModal: (state) => {
            state.isActive = true;
        },
        openModalInUpdateMode: (state) => {
            state.isActive = true;
            state.isInUpdateMode = true;
        },
        openSubscriptionPanelInUpdateMode: (state) => {
            state.isActive = true;
            state.isInUpdateMode = true;
            state.openSubscriptionPanel = true;
            state.openExtensionsPanel = false;
        },
        openExtensionsPanelInUpdateMode: (state) => {
            state.isActive = true;
            state.isInUpdateMode = true;
            state.openSubscriptionPanel = false;
            state.openExtensionsPanel = true;
        },
        closeModal: (state) => {
            state.isActive = false;
            state.isInUpdateMode = false;
        }
    }
})

export const {
    openModal,
    openModalInUpdateMode,
    openSubscriptionPanelInUpdateMode,
    openExtensionsPanelInUpdateMode,
    closeModal,
} = subscriptionUI.actions;
export default subscriptionUI.reducer;