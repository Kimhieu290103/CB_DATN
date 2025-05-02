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
        getAllClasses: builder.query({
            query: () => "/api/v1/class/all",
            providesTags: ['Class'],
          }),
          createClass: builder.mutation({
            query: (newClass) => ({
                url: "/api/v1/class/create",
                method: "POST",
                body: newClass,
            }),
            invalidatesTags: ['Class'],
        }),
        updateClass: builder.mutation({
            query: ({ id, name, departmentId, courseId, status }) => ({
              url: `/api/v1/class/update/${id}`,
              method: "PUT",
              body: { name, departmentId, courseId, status },
            }),
            invalidatesTags: ['Class'],  
          }),
          deleteClass: builder.mutation({
            query: (id) => ({
              url: `/api/v1/class/status/${id}`,
              method: "PUT"
            }),
            invalidatesTags: ['Class'],
          }),
          getAllClassesPaged: builder.query({
            query: ({ page = 0, limit = 10 }) => `/api/v1/class/paged?page=${page}&limit=${limit}`,
            providesTags: ['Class'],
        }),
        
        
    }),
});

export const { 
    useGetDepartmentQuery,
    useGetCoursesQuery,
    useGetClassesMutation,
    useGetAllClassesQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
    useGetAllClassesPagedQuery, 
 } = otherApiSlice;