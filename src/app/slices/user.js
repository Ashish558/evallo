import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  id: '',
  firstName: '',
  lastName: '',
  credits: 0,
  amountToPay: 0,
  timeZone: '',
  role: '',
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    updateTimeZone: (state, { payload }) => {
      state.timeZone = payload.timeZone;
    },
    updateUserDetails: (state, { payload }) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.id = payload.id;
      state.amountToPay = payload.amountToPay;
      state.credits = payload.credits;
      state.timeZone = payload.timeZone ? payload.timeZone : '';
      state.role = payload.role;
    },
  },
});

export const { updateIsLoggedIn, updateUserDetails, updateTimeZone } = user.actions;
export default user.reducer;
