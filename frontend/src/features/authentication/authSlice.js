import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "authenticator",
    initialState: {
        isAuthenticated: false,
        isAuthLoading: true,
        user: null,
    },

    reducers: {
        setAuth: (state, action) => {
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                isAuthLoading: false,
                user: action.payload.user,
            };
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.isAuthLoading = false;
            state.user = null;
        },
    },
});

export const authSelector = (state) => state.auth;

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
