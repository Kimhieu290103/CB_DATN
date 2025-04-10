import { apiSlice } from "../apiSlice";

export const otherApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepartment: builder.query({
            query: () => "/api/v1/departments",
        }),
        getCourses: builder.query({
            query: () => "/api/v1/courses",
        }),
        getClasses: builder.mutation({
            query: (params) => ({
                url: "/api/v1/class/search",
                method: "POST",
                body: params,
            }),
        }),
    }),
});

export const { 
    useGetDepartmentQuery,
    useGetCoursesQuery,
    useGetClassesMutation,
 } = otherApiSlice;