import { apiSlice } from "../apiSlice";

export const studentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllStudents: builder.query({
            query: ({ page = 0, limit = 10 }) =>
                `/api/v1/users/students?page=${page}&limit=${limit}`,
            providesTags: ['Students'],
        }),
        getAllLcd: builder.query({
            query: ({ page = 0, limit = 10 }) =>
                `/api/v1/users/lcdlist?page=${page}&limit=${limit}`,
            providesTags: ['Lcd'],
        }),
        getAllOtherAccount: builder.query({
            query: () =>
                `/api/v1/users/exclude-sv-lcd`,
            providesTags: ['OtherAccount'],
        }),
        registerStudent: builder.mutation({
            query: (studentData) => ({
                url: `/api/v1/users/register`,
                method: 'POST',
                body: studentData,
            }),
            invalidatesTags: ['Students'], // Cập nhật danh sách sinh viên sau khi đăng ký
        }),
        bulkRegisterStudents: builder.mutation({
            query: (formData) => ({
                url: `/api/v1/users/add-student-exel`,
                method: 'POST',
                body: formData,
                formData: true, // Cho phép multipart/form-data
            }),
            invalidatesTags: ['Students'],
        }),
        // Endpoint tìm kiếm sinh viên
        searchStudents: builder.query({
            query: ({ search, page = 0, size = 10 }) =>
                `/api/v1/users/search/student?search=${search}&page=${page}&size=${size}`,
            providesTags: ['Students'],
        }),


         // 👇 Thêm mới: API lấy thông tin tài khoản
         getUserInfo: builder.query({
            query: () => `/api/v1/users/info`,
        }),
        changePassword: builder.mutation({
            query: (credentials) => ({
                url: `/api/v1/users/change-password`,
                method: 'POST',
                body: credentials, // { oldPassword: '...', newPassword: '...' }
            }),
        }),
        
    }),
});

export const {
    useGetAllStudentsQuery,
    useGetAllLcdQuery,
    useGetAllOtherAccountQuery,
    useRegisterStudentMutation,
    useBulkRegisterStudentsMutation,
    useSearchStudentsQuery,
    useGetUserInfoQuery,
    useChangePasswordMutation,
} = studentApiSlice;
