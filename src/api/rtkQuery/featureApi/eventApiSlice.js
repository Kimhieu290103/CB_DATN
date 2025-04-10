import { apiSlice } from "../apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEvent: builder.mutation({
            query: (data) => ({
                url: '/api/v1/events/createEventImage',
                method: 'POST',
                body: data
            }),
        }),
        editEvent: builder.mutation({
            query: ({ eventId, formData }) => ({
                url: `/api/v1/events/${eventId}`,
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ['Events'],
        }),
        removeEvent: builder.mutation({
            query: (id) => ({
                url: `/api/v1/events/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Events'],
        }),
        exportEventRegistration: builder.mutation({
            query: (eventID) => ({
                url: `/api/v1/registrations/export/${eventID}`,
                method: "GET",
                responseHandler: async (response) => {
                    if (!response.ok) throw new Error("Lỗi khi tải file!");
                    return response.blob();
                },
            }),
        }),
        // --------------------------------------------


        // --------------------------------------------
        getAllMyEvents: builder.query({
            query: ({ page, rowsPerPage }) => `/api/v1/events/my-events?page=${page}&limit=${rowsPerPage}`,
            providesTags: ['Events'],
        }),
        getAllEvents: builder.query({
            query: ({ page, rowsPerPage }) => `/api/v1/events/all?page=${page}&limit=${rowsPerPage}`,
            providesTags: ['AllEvents'],
        }),
        getEventById: builder.query({
            query: (id) => `/api/v1/events/all/${id}`,
        }),
        getEventRegistration: builder.query({
            query: (id) => `/api/v1/registrations/event/${id}`,
            providesTags: ['EventRegistration'],
        }),
        getAcademicYears: builder.query({
            query: () => "/api/v1/semesters",
        }),

        getExternalEvents: builder.query({
            query: () => "/api/external-events/pending",
            providesTags: ['ExternalEvents'],
        }),
        approvedExternalEvent: builder.mutation({
            query: (id) => ({
                url: `/api/v1/points/${id}/approve`,
                method: 'PUT',
            }),
            invalidatesTags: ['ExternalEvents'],
        }),
        rejectedExternalEvent: builder.mutation({
            query: (id) => ({
                url: `/api/v1/points/${id}/reject`,
                method: 'PUT',
            }),
            invalidatesTags: ['ExternalEvents'],
        }),
        // --------------------------------------------


        // --------------------------------------------
        approvedSelectedStudents: builder.mutation({
            query: ({eventID, listStudentIDs}) => ({
                url: `api/v1/points/batch/${eventID}`,
                method: 'POST',
                body: listStudentIDs
            }),
            invalidatesTags: ['EventRegistration'],
        }),
        approvedStudent: builder.mutation({
            query: ({studentID, eventID}) => ({
                url: `/api/v1/points/${studentID}/${eventID}`,
                method: 'POST',
            }),
            invalidatesTags: ['EventRegistration'],
        }),
        approvedAllStudents: builder.mutation({
            query: (eventID) => ({
                url: `/api/v1/points/batchAll/${eventID}`,
                method: 'POST',
            }),
            invalidatesTags: ['EventRegistration'],
        }),
        // --------------------------------------------
    }),
});

export const { useCreateEventMutation, 
                useEditEventMutation,
                useRemoveEventMutation,
                useExportEventRegistrationMutation,
                useGetAllMyEventsQuery,
                useGetAllEventsQuery,
                useGetEventByIdQuery, 
                useGetEventRegistrationQuery,
                useGetAcademicYearsQuery,
                useGetExternalEventsQuery,
                useApprovedExternalEventMutation,
                useRejectedExternalEventMutation,
                useApprovedSelectedStudentsMutation,
                useApprovedStudentMutation,
                useApprovedAllStudentsMutation,
            } = eventApiSlice;