import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authentication/authSlice";
import profileReducer from "../features/profile/profileSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});
