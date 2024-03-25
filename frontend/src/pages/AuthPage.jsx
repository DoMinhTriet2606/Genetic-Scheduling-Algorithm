import React from "react";
import AuthForm from "../components/auth/AuthForm";

import "../assets/css/auth/auth.css";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../features/authentication/authSlice";

const AuthPage = () => {
    const { isAuthenticated, isAuthLoading } = useSelector(authSelector);
    let body = null;
    if (isAuthLoading) {
        body = <h1>Loading...</h1>;
    } else if (isAuthenticated) {
        return <Navigate to="/user/main" />;
    } else {
        body = <AuthForm />;
    }

    return <>{body}</>;
};

export default AuthPage;
