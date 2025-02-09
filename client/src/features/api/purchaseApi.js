import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = "http://localhost:8080/api/v1/purchase/";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  //   tagTypes: ["Refetch_creator_course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: ({ courseId }) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/details-with-status`,
        method: "GET",
      }),
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `get-all-purchasedCourses`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
