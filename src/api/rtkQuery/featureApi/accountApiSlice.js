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
       
    }),
});

export const {
    useGetAllStudentsQuery,
    useGetAllLcdQuery,
    useGetAllOtherAccountQuery,
    useRegisterStudentMutation
} = studentApiSlice;
