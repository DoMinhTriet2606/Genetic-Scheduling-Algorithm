import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/authService";
import Swal from "sweetalert2";

const AuthForm = () => {
    const [isSignup, setIsSignup] = useState(false);

    const switchToSignup = () => {
        setIsSignup(true);
    };

    const switchToSignin = () => {
        setIsSignup(false);
    };

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleLoginForm = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    };
    const handleRegisterForm = (event) => {
        setRegisterData({
            ...registerData,
            [event.target.name]: event.target.value,
        });
    };

    const authService = AuthService();

    const handleSubmitLogin = async (event) => {
        event.preventDefault();

        const responseData = await authService.loginUser(loginData);
        if (!responseData.success) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: responseData.error,
            });
        }
    };

    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Passwords do not match",
            });
            return;
        } else {
            const responseData = await authService.registerUser(registerData);
            if (responseData.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "You have successfully registered",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: responseData.errors.username
                        ? responseData.errors.username[0]
                        : responseData.errors.email[0],
                });
                return;
            }
        }
    };

    return (
        <div className={`auth__container ${isSignup ? "active" : ""}`}>
            <div className="container">
                <div className="blueBg">
                    <div className={`box signin ${!isSignup ? "active" : ""}`}>
                        <h2>Already Have an Account ?</h2>
                        <button className="signinBtn" onClick={switchToSignin}>
                            Sign in
                        </button>
                    </div>

                    <div className={`box signup ${isSignup ? "active" : ""}`}>
                        <h2>Don't Have an Account ?</h2>
                        <button className="signupBtn" onClick={switchToSignup}>
                            Sign up
                        </button>
                    </div>
                </div>

                <div className={`formBx ${isSignup ? "active" : ""}`}>
                    <div className="form signinForm">
                        <form onSubmit={handleSubmitLogin}>
                            <h3>Sign In</h3>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                placeholder="Email"
                                required
                                onChange={handleLoginForm}
                            />
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                placeholder="Password"
                                required
                                onChange={handleLoginForm}
                            />
                            <input type="submit" value="Login" />
                            <Link to="/" className="forgot">
                                Forgot Password
                            </Link>
                        </form>
                    </div>

                    <div className="form signupForm">
                        <form onSubmit={handleSubmitRegister}>
                            <h3>Sign Up</h3>
                            <input
                                type="text"
                                name="username"
                                value={registerData.username}
                                placeholder="Username"
                                required
                                onChange={handleRegisterForm}
                            />
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                placeholder="Email Address"
                                required
                                onChange={handleRegisterForm}
                            />
                            <input
                                type="password"
                                name="password"
                                value={registerData.password}
                                placeholder="Password"
                                required
                                onChange={handleRegisterForm}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={registerData.confirmPassword}
                                placeholder="Confirm Password"
                                required
                                onChange={handleRegisterForm}
                            />
                            <input type="submit" value="Register" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
