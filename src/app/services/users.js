import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constants";

// 
export const userServicesApi = createApi({
   reducerPath: "usersApi",
   baseQuery: fetchBaseQuery({
      baseUrl: BASE_URL,
   }),

   endpoints: (builder) => ({
      getAllUsers: builder.query({
         query: () => ({
            url: `api/user`,
            params: {
               limit: 200
            },
            method: "GET",
         }),
      }),
      getPersonalDetail: builder.query({
         query: (body) => ({
            url: `api/user/mydetails`,
            method: "GET",
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         }),
      }),
      getParentTutors: builder.query({
         query: (body) => ({
            url: `api/user/parent/tutors/${body.id}`,
            method: "GET",
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         }),
      }),
      getStudentTutors: builder.query({
         query: (body) => ({
            url: `api/user/student/tutors/${body.id}`,
            method: "GET",
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         }),
      }),
      getUserDetail: builder.query({
         query: (body) => ({
            url: `api/user/${body.id}`,
            method: "GET",
         }),
      }),
      getTutorDetails: builder.query({
         query: (body) => ({
            url: `api/user/tutordetails/${body.id}`,
            method: "GET",
         }),
      }),
      updateUserFields: builder.mutation({
         query: (body) => ({
            url: `api/user/${body.id}`,
            method: "PATCH",
            body: body.fields,
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         })
      }),
      updateUserDetails: builder.mutation({
         query: (body) => ({
            url: `api/user/updatedetails/${body.id}`,
            method: "PATCH",
            body: body.fields,
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         })
      }),
      updateTutorDetails: builder.mutation({
         query: (body) => ({
            url: `api/user/tutordetails/${body.id}`,
            method: "PATCH",
            body: body.fields,
            headers: {
               "Authorization": sessionStorage.getItem('token'),
            },
         })
      }),
      addUser: builder.mutation({
         query: (body) => ({
            url: `/api/user/addtutor`,
            method: "POST",
            body: body,
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         })
      }),

   }),
});

export const {
   useLazyGetAllUsersQuery,
   useLazyGetParentTutorsQuery,
   useLazyGetStudentTutorsQuery,
   useAddUserMutation,
   useLazyGetUserDetailQuery,
   useLazyGetTutorDetailsQuery,
   useUpdateUserFieldsMutation,
   useUpdateUserDetailsMutation,
   useUpdateTutorDetailsMutation,
   useLazyGetPersonalDetailQuery
} = userServicesApi;
