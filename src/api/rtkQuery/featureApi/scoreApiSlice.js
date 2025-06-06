import { apiSlice } from "../apiSlice";

export const scoreApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCommunityScore: builder.query({
            query: ({departmentID, courseID, classID, semesterID, page = 0, size = 10}) => 
                `/api/v1/points?departmentId=${departmentID}&courseId=${courseID}&classId=${classID}&semesterId=${semesterID}&page=${page}&size=${size}`,
        }),
         // Thêm endpoint mới cho attended registrations
         getAttendedRegistrations: builder.query({
            query: ({ semesterId, userId }) => 
                `/api/v1/registrations/attended/${userId}?semesterId=${semesterId}`,
        }),
    }),
});

export const { 
    useGetCommunityScoreQuery,
    useGetAttendedRegistrationsQuery

} = scoreApiSlice;