import { useEffect } from "react";
import setAuthToken from "../utils/setAuthToken";
import axios from "./axios";

import { useDispatch } from "react-redux";
import { logout, setAuth } from "../features/authentication/authSlice";

const AuthService = () => {
    const dispatch = useDispatch();
    const loadUser = async () => {
        if (localStorage["accessToken"]) setAuthToken(localStorage["accessToken"]);

        try {
            const response = await axios.get("user/auth/");
            if (response.data.success) {
                console.log(response.data.message);
                dispatch(setAuth({ isAuthenticated: true, user: response.data.user }));
            }
        } catch (error) {
            localStorage.removeItem("accessToken");
            setAuthToken(null);
            dispatch(setAuth({ isAuthenticated: false, user: null }));
        }
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loginUser = async (loginData) => {
        try {
            const response = await axios.post("user/login/", loginData);
            if (response.data.success) {
                console.log(response.data.user);
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                loadUser();
            }
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    };

    const logoutUser = async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // dispatch(logout());
        window.location.href = "/authenticate";
    };

    const registerUser = async (registerData) => {
        try {
            const response = await axios.post("user/register/", registerData);
            if (response.data.success) {
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
            }
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    };

    const changePassword = async (password) => {
        try {
            const response = await axios.put("user/change_password", password);
            return response.data;
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return { loadUser, loginUser, logoutUser, registerUser, changePassword };
};

export default AuthService;
