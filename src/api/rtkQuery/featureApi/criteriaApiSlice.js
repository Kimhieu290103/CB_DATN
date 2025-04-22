import { apiSlice } from "../apiSlice";

export const criteriaApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFalcutyCriteria: builder.query({
            query: () => "/api/v1/five_good_lcd/all",
            providesTags: ['FalcutyCriteria'],
        }),
        getSchoolCriteria: builder.query({
            query: () => "/api/v1/five_good/all",
            providesTags: ['SchoolCriteria'],
        }),
        getEventCriterias: builder.query({
            query: (eventID) => `/api/v1/events/criteria/${eventID}`,
        }),


        getFalcutyCriteriaInSemester: builder.query({
            query: (semesterID) => `/api/v1/five_good_lcd/${semesterID}`,
            providesTags: ['FalcutyCriteria'],
        }),
        getSchoolCriteriaInSemester: builder.query({
            query: (semesterID) => `/api/v1/five_good/${semesterID}`,
            providesTags: ['SchoolCriteria'],
        }),

        removeSchoolCriteria: builder.mutation({
            query: (id) => ({
                url: `/api/v1/five_good/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SchoolCriteria'],
        }),
        removeFalcutyCriteria: builder.mutation({
            query: (id) => ({
                url: `/api/v1/five_good_lcd/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['FalcutyCriteria'],
        }),
        // Thêm vào trong `endpoints: (builder) => ({ ... })`
        getCompletedStudentCriteria: builder.query({
            query: (semesterId) => `/api/v1/student_criteria/completed?semesterId=${semesterId}`,
        }),
            // Thêm vào trong `endpoints: (builder) => ({ ... })`
        getCompletedLcdCriteria: builder.query({
            query: (semesterId) => `/api/v1/lcd_criteria/completed?semesterId=${semesterId}`,
        }),


        // sửa tiêu chí
        updateSchoolCriteria: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/v1/five_good/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['SchoolCriteria'],
        }),

        // thêm tiêu chí
          // Mutation để thêm tiêu chí mới
          addSchoolCriteria: builder.mutation({
            query: (newCriteria) => ({
                url: "/api/v1/five_good", // URL API của bạn
                method: "POST", // Phương thức POST
                body: newCriteria, // Dữ liệu gửi lên API
            }),
            // Sau khi thành công, có thể invalidates các tag liên quan hoặc tự động refetch lại
            invalidatesTags: ['SchoolCriteria'],
        }),
         // sửa tiêu chí
         updateFalcutyCriteria: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/v1/five_good_lcd/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['FalcutyCriteria'],
        }),

        // thêm tiêu chí
          // Mutation để thêm tiêu chí mới
          addFalcutyCriteria: builder.mutation({
            query: (newCriteria) => ({
                url: "/api/v1/five_good_lcd", // URL API của bạn
                method: "POST", // Phương thức POST
                body: newCriteria, // Dữ liệu gửi lên API
            }),
            // Sau khi thành công, có thể invalidates các tag liên quan hoặc tự động refetch lại
            invalidatesTags: ['FalcutyCriteria'],
        }),
        

    }),
});

export const { useGetFalcutyCriteriaQuery,
                useGetSchoolCriteriaQuery,
                useGetEventCriteriasQuery,
                useGetFalcutyCriteriaInSemesterQuery,
                useGetSchoolCriteriaInSemesterQuery,
                useRemoveSchoolCriteriaMutation,
                useRemoveFalcutyCriteriaMutation,
                useGetCompletedStudentCriteriaQuery,
                useGetCompletedLcdCriteriaQuery,
                useUpdateSchoolCriteriaMutation,
                useAddSchoolCriteriaMutation,
                useUpdateFalcutyCriteriaMutation,
                useAddFalcutyCriteriaMutation,
            } = criteriaApiSlice;