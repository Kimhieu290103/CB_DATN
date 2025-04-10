import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    login: {
        user: null,
        token: null,
        refreshToken: null,
        role: null,
    },
    register: {
        user: null,
        error: false,
        ErrorMessage: null,
    },
    forgetPasswordInfo: null,
    errorMessage: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setCredentials(state, action) {
            const { accessToken, refreshToken, userResponse, role } = action.payload;
            state.login.user = userResponse;
            state.login.token = accessToken;
            state.login.refreshToken = refreshToken;
            state.login.role = role;
        },

        setAvatar(state, action) {
            state.login.user.avatar = action.payload;
        },

        logout(state) {
            state.login.user = null;
            state.login.token = null;
            state.login.role = null;
            state.errorMessage = null; 
        },

        register(state, action) {
            state.register.user = action.payload;
            state.register.error = false;
        },

        clearRegister(state) {
            state.register = {
                user: null,
                error: false,
                ErrorMessage: null,
            };
        }, 

        forgetPassword(state, action) {
            state.forgetPasswordInfo = action.payload;
        },

        clearForgetPassword(state) {
            state.forgetPasswordInfo = null;
        },
        setErrorMessage: (state, action) => {  // Định nghĩa action này
            state.errorMessage = action.payload;
        }
    },
});

export const { 
    setCredentials, 
    setAvatar, 
    logout, 
    register, 
    clearRegister, 
    forgetPassword, 
    clearForgetPassword, 
    setErrorMessage 
} = authSlice.actions;

export default authSlice.reducer;