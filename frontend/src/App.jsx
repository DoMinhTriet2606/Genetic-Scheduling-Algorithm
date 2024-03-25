import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/routing/Landing";
import ProtectedRoute from "./components/routing/ProtectedRoute";

import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";

import UserView from "./views/UserView";

import Header from "./components/layouts/Header";

import "./assets/css/animations/animations.css";
import AuthService from "./services/authService";
import ShiftView from "./views/ShiftView";
import SalaryView from "./views/SalaryView";
import MailView from "./views/MailView";
import UserService from "./services/userService";

function App() {
    AuthService();
    UserService();
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/authenticate" element={<AuthPage />} />

                <Route
                    path="/user/main"
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/information"
                    element={
                        <ProtectedRoute>
                            <UserView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/shift"
                    element={
                        <ProtectedRoute>
                            <ShiftView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/salary"
                    element={
                        <ProtectedRoute>
                            <SalaryView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/mail"
                    element={
                        <ProtectedRoute>
                            <MailView />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
