import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organization: {

  }
};

const organization = createSlice({
  name: "organization",
  initialState,
  reducers: {
    updateOrganization: (state, { payload }) => {
      state.organization = payload;
    },
  },
});

export const { updateOrganization } = organization.actions;
export default organization.reducer;
