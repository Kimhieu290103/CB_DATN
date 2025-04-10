import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventID: null,
    isEdit: false,
    eventName: "",
};

const authSlice = createSlice({
    name: "events",
    initialState,

    reducers: {
        getEventID(state, action) {
            const { id, isEdit } = action.payload;
            state.eventID = id;
            state.isEdit = isEdit;
        },
        getEventName(state, action) {
            state.eventName = action.payload;
        },
    },
});

export const { 
    getEventID,
    getEventName,
} = authSlice.actions;

export default authSlice.reducer;