import React from "react";
import Navigator from "../components/layouts/Navigator";

import "../assets/css/pages/main.css";
import SideNav from "../components/layouts/SideNav";
import { useSelector } from "react-redux";
import { authSelector } from "../features/authentication/authSlice";

const MainPage = () => {
    const { user, isAuthLoading } = useSelector(authSelector);
    if (isAuthLoading) return <h1>Loading...</h1>;
    return (
        <div>
            <div className="page__container">
                <section className="main__container">
                    <div className="greeting">
                        <h1>Welcome, {user.username}</h1>
                        <h2>Have a nice day at work!</h2>
                    </div>
                    <Navigator />
                </section>
            </div>
            <SideNav />
        </div>
    );
};

export default MainPage;
