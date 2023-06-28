import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organization: {
    settings: {}
  }
};

const organization = createSlice({
  name: "organization",
  initialState,
  reducers: {
    updateOrganization: (state, { payload }) => {
      state.organization = payload;
    },
    updateOrganizationSettings: (state, { payload }) => {
      state.organization.settings = payload;
    },
  },
});

export const { updateOrganization, updateOrganizationSettings } = organization.actions;
export default organization.reducer;
