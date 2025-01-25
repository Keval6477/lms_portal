import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_creator_course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "create",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_creator_course"],
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "getAllCourses",
        method: "GET",
      }),
      providesTags: ["Refetch_creator_course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `updateCourse/${courseId}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
} = courseApi;
