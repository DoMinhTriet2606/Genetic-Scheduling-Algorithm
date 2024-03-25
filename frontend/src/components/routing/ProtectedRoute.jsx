import React from "react";
import { authSelector } from "../../features/authentication/authSlice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useSelector(authSelector);

    if (isAuthLoading) {
        return <h1>Loading...</h1>;
    }
    if (isAuthenticated) {
        return <>{children}</>;
    } else {
        return <Navigate to="/authenticate" />;
    }
};

export default ProtectedRoute;
