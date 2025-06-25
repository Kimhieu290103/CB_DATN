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

          // Thêm API upload ảnh
          uploadEventImage: builder.mutation({
            query: ({ eventId, imageData }) => ({
                url: `/api/v1/events/uploadImage/${eventId}`,
                method: 'POST',
                body: imageData,
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
            query: () => "/api/v1/external-events/pending",
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
        removeStudentFromEvent: builder.mutation({
            query: ({ studentId, eventId }) => ({
                url: `/api/v1/registrations/${eventId}/student/${studentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EventRegistration'],
        }),

        cancelAttendance: builder.mutation({
            query: ({ studentId, eventId }) => ({
                url: `/api/v1/points/attendance/${studentId}/${eventId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EventRegistration'],
        }),

        // --------------------------------------------

        // ----------------------------- tìm event -----------------------------
      
        getEventsByName: builder.query({
            query: (name) => `/api/v1/events/search?name=${encodeURIComponent(name)}`,
          }),

          getMyEventsByName: builder.query({
            query: (name) => `/api/v1/events/search-myevents?name=${encodeURIComponent(name)}`,
          }),
          
        //......................................................


         getExternalEventsByStatus: builder.query({
      query: ({ userId,semesterId }) => 
        `/api/v1/external-events/approved?userId=${userId}&semesterId=${semesterId}`,
    }),


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
                useUploadEventImageMutation, 
                useGetEventsByNameQuery,
                useGetMyEventsByNameQuery,
                useGetExternalEventsByStatusQuery,
                useRemoveStudentFromEventMutation,
                useCancelAttendanceMutation,
            } = eventApiSlice;