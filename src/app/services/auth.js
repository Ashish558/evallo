import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constants";


export const authServicesApi = createApi({
   reducerPath: "authApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({
      // getTutorsByName: builder.query({
      //    query: (name) => ({
      //       url: `api/user/tutor`,
      //       params: {
      //          search: name
      //       },
      //       method: "GET",
      //    }),
      // }),
   
      signupUser: builder.mutation({
         query: (body) => ({
            url: `/api/user/signup`,
            method: "POST",
            body: body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      addUserDetails: builder.mutation({
         query: (payload) => ({
            url: `/api/user/adddetails/${payload.userId}`,
            method: "POST",
            body: payload.body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      setPassword: builder.mutation({
         query: (payload) => ({
            url: `/api/user/verify/${payload.userId}`,
            method: "POST",
            body: payload.body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      loginUser: builder.mutation({
         query: (body) => ({
            url: `/api/user/login`,
            method: "POST",
            body: body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      forgotPassword: builder.mutation({
         query: (body) => ({
            url: `/api/user/resetpassword`,
            method: "POST",
            body: body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),
      changePassword: builder.mutation({
         query: (payload) => ({
            url: `/api/user/changepassword/${payload.userId}`,
            method: "POST",
            body: payload.body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),

   }),
});

export const {
  useSignupUserMutation,
  useAddUserDetailsMutation,
  useSetPasswordMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation
} = authServicesApi;
