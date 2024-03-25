import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name: "profile",
    initialState: {
        userProfile: null,
        profileLoading: true,
    },

    reducers: {
        fetchUserProfile: (state, action) => {
            console.log("From Store: ", action.payload);
            return {
                ...state,
                userProfile: action.payload,
                profileLoading: false,
            };
        },
    },
});

export const profileSelector = (state) => state.profile;

export const { fetchUserProfile } = profileSlice.actions;
export default profileSlice.reducer;
