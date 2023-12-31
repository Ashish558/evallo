import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, getAuthHeader } from "../constants/constants";

//
export const userServicesApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // credentials: "include"
  }),

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: `api/user${params}`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getPersonalDetail: builder.query({
      query: (body) => ({
        url: `api/user/mydetails`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getAuth: builder.query({
      query: () => ({
        url: `api/v1/auth/login/success`,
        method: "GET",
        headers: getAuthHeader(),
      })
    }),
    getAllOrgUsers: builder.query({
      query: () => ({
        url: `api/user`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `api/user/one/${id}`,
        method: "GET",
       
      }),
    }),
    getParentTutors: builder.query({
      query: (body) => ({
        url: `api/user/parent/tutors/${body.id}`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getStudentTutors: builder.query({
      query: (body) => ({
        url: `api/user/student/tutors/${body.id}`,
        method: "GET",
        headers: getAuthHeader(),
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
        headers: getAuthHeader(),
      }),
    }),
    getAssignedStudentsDetails: builder.query({
      query: (body) => ({
        url: `api/user/tutor/getAssignedStudents/${body.id}`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getFeedback: builder.query({
      query: (body) => ({
        url: `api/feedback/rating/allRating?userId=${body.id}`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    addTutorReview: builder.mutation({
      query: (body) => ({
        url: `api/feedback/tutor/review`,
        method: "POST",
        body,
        headers: getAuthHeader(),
      }),
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `api/user/updateUser/${body.userId}`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    bulkChangeUserStatus: builder.mutation({
      query: (body) => ({
        url: `api/user/bulkChangeUserStatus`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      })
    }),
    addManager: builder.mutation({
      query: (body) => ({
        url: `api/user/registerManager`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    updateUserFields: builder.mutation({
      query: (body) => ({
        url: `api/user/${body.id}`,
        method: "PATCH",
        body: body.fields,
        headers: getAuthHeader(),
      }),
    }),
    addNotes: builder.mutation({
      query: (body) => ({
        url: `api/user/notes/addNotes`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    updateUserDetails: builder.mutation({
      query: (body) => ({
        url: `api/user/updatedetails/${body.id}`,
        method: "PATCH",
        body: body.fields,
        headers: getAuthHeader(),
      }),
    }),
    postTutorDetails: builder.mutation({
      query: (body) => ({
        url: `api/user/tutordetails/${body.id}`,
        method: "POST",
        body: body.fields,
        headers: getAuthHeader(),
      }),
    }),
    updateTutorDetails: builder.mutation({
      query: (body) => ({
        url: `api/user/tutordetails/${body.id}`,
        method: "PATCH",
        body: body.fields,
        headers: getAuthHeader(),
      }),
    }),
    updateProfileImage: builder.mutation({
      query: (body) => ({
        url: `/api/user/addphoto`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: `/api/user/adduser`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    getInvoice: builder.query({
      query: (body) => ({
        url: `api/invoice/`,
        params: {
          _id: body.id,
        },
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    getOrganization: builder.query({
      query: (id) => ({
        url: `api/user/org/details/${id}`,
        method: "GET",
        headers: getAuthHeader(),
      }),
    }),
    updateUserAccount: builder.mutation({
      query: (body) => ({
        url: `/api/user`,
        method: "PATCH",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    resentEmail: builder.mutation({
      query: (body) => ({
        url: `api/user/resent/mail`,
        method: "POST",
        body: body,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),

    getLinkStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/getLink`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    addLinkStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/addLink`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    removeLinkStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/removeLink`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    addAssociatedDocStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/uploadAssociatedDoc`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    conceptChartStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/conceptChart`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    scoreProgressionStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/scoreProgression`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    chartBubbleStudent: builder.mutation({
      query: (body) => ({
        url: `api/user/student/chart`,
        method: "POST",
        body: body,
        headers: getAuthHeader(),
      }),
    }),
    deletePaymentMethod: builder.mutation({
      query: (body) => {
        console.log("inside deletePaymentMethod RTK");
        console.log("paymentMethodId");
        console.log(body.paymentMethodId);
        return {
        url: `api/stripe/del/${body.customerId}/${body.paymentMethodId}`,
        method: "DELETE",
        headers: getAuthHeader(),
      }},
    })
  }),
});

export const {
  useChartBubbleStudentMutation,
  useAddTutorReviewMutation,
  useLazyGetAllUsersQuery,
  useLazyGetParentTutorsQuery,
  useAddNotesMutation,
  useLazyGetStudentTutorsQuery,
  useAddUserMutation,
  useUpdateUserAccountMutation,
  useLazyGetAllOrgUsersQuery,
  useGetAllOrgUsersQuery,
  useLazyGetUserDetailQuery,
  useLazyGetTutorDetailsQuery,
  useUpdateUserFieldsMutation,
  useGetUserDetailQuery,
  useAddManagerMutation,
  useUpdateUserDetailsMutation,
  useUpdateTutorDetailsMutation,
  usePostTutorDetailsMutation,
  useLazyGetPersonalDetailQuery,
  useResentEmailMutation,
  useGetOrganizationQuery,
  useLazyGetAssignedStudentsDetailsQuery,
  useLazyGetInvoiceQuery,
  useUpdateProfileImageMutation,
  useLazyGetOrganizationQuery,
  useUpdateUserMutation,
  useLazyGetSingleUserQuery,
  useScoreProgressionStudentMutation,
  useConceptChartStudentMutation,
  useAddAssociatedDocStudentMutation,
  useRemoveLinkStudentMutation,
  useAddLinkStudentMutation,
  useGetLinkStudentMutation,
  useLazyGetFeedbackQuery,
  useGetAuthQuery,
  useLazyGetAuthQuery,
  useBulkChangeUserStatusMutation,
  useDeletePaymentMethodMutation,
} = userServicesApi;
