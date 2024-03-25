import React from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import "../../assets/css/layouts/sidenav.css";
import AuthService from "../../services/authService";

const SideNav = () => {
    const authService = AuthService();

    const handleLogout = async () => {
        await authService.logoutUser();
    };
    return (
        <motion.div
            initial={{
                scale: 0.5,
                opacity: 0,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            transition={{
                duration: 0.3,
                ease: [0, 0.71, 0.2, 1.01],
                scale: {
                    type: "spring",
                    damping: 5,
                    stiffness: 100,
                    restDelta: 0.001,
                },
            }}
            className="side-nav__container"
        >
            <div className="side-nav__index">
                <label htmlFor="check">
                    <input type="checkbox" id="check" />
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </div>

            <ul className="side-nav__list">
                <div className="side-nav__item">
                    <Link to="/user/main">
                        <i className="fa-solid fa-house"></i>
                    </Link>
                </div>
                <div className="side-nav__item">
                    <i className="fa-solid fa-bell"></i>
                </div>
                <div className="side-nav__item" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </div>
            </ul>
        </motion.div>
    );
};

export default SideNav;
