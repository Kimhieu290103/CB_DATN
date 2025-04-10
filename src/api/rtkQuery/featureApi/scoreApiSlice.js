import { apiSlice } from "../apiSlice";

export const scoreApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCommunityScore: builder.query({
            query: ({departmentID, courseID, classID, semesterID}) => 
                `/api/v1/points?departmentId=${departmentID}&courseId=${courseID}&classId=${classID}&semesterId=${semesterID}`,
        }),
    }),
});

export const { 
    useGetCommunityScoreQuery,

} = scoreApiSlice;