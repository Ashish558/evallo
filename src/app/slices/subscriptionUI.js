import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isActive: false,
    isInUpdateMode: false,
    isInRenewProductMode: false,
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
            state.isInRenewProductMode = false;
            state.openSubscriptionPanel = true;
            state.openExtensionsPanel = false;
        },
        openExtensionsPanelInUpdateMode: (state) => {
            state.isActive = true;
            state.isInUpdateMode = true;
            state.isInRenewProductMode = false;
            state.openSubscriptionPanel = false;
            state.openExtensionsPanel = true;
        },
        openSubscriptionPanelInRenewProductMode: (state) => {
            state.isActive = true;
            state.isInUpdateMode = false;
            state.isInRenewProductMode = true;
            state.openSubscriptionPanel = true;
            state.openExtensionsPanel = false;
        },
        openExtensionPanelInRenewProductMode: (state) => {
            state.isActive = true;
            state.isInUpdateMode = false;
            state.isInRenewProductMode = true;
            state.openSubscriptionPanel = false;
            state.openExtensionsPanel = true;
        },
        closeModal: (state) => {
            state.isActive = false;
            state.isInUpdateMode = false;
            state.isInRenewProductMode = false;
        }
    }
})

export const {
    openModal,
    openModalInUpdateMode,
    openSubscriptionPanelInUpdateMode,
    openExtensionsPanelInUpdateMode,
    openSubscriptionPanelInRenewProductMode,
    openExtensionPanelInRenewProductMode,
    closeModal,
} = subscriptionUI.actions;
export default subscriptionUI.reducer;