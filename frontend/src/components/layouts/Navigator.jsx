import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "../../assets/css/layouts/navigator.css";

const menuItems = [
    {
        title: "User",
        icon: "fa-solid fa-user",
        description: "Including user's account and user's profile",
        link: "/user/information",
    },
    {
        title: "Shift",
        icon: "fa-solid fa-briefcase",
        description: "Viewing user's shift table in current week.",
        link: "/user/shift",
    },
    {
        title: "Salary",
        icon: "fa-solid fa-money-check-dollar",
        description: "Viewing user's salary in one month.",
        link: "/user/salary",
    },
    {
        title: "Mail",
        icon: "fa-solid fa-envelope",
        description: "Communicating with Manager.",
        link: "/user/mail",
    },
];

const list = {
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            // staggerChildren: 0.4,
        },
    },
    hidden: {
        opacity: 0,
        transition: {
            when: "afterChildren",
        },
    },
};

const item = {
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: index * 0.2,
        },
    }),
    hidden: { opacity: 0, y: 80 },
};

// Style
const NavUnlisted = styled.ul`
    a {
        border-radius: 50%;
    }
    .active {
        width: 100px;
        height: 100px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
            rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
    }
`;

const Navigator = () => {
    return (
        <NavUnlisted>
            <motion.ul
                initial="hidden"
                animate="visible"
                variants={list}
                className="nav__container"
            >
                {menuItems.map((menuItem, index) => (
                    <motion.li variants={item} custom={index} className="nav__item" key={index}>
                        <NavLink to={menuItem.link}>
                            <h2>{menuItem.title}</h2>
                            <i className={menuItem.icon}></i>
                            <div className="nav__info">
                                <p>{menuItem.description}</p>
                            </div>
                        </NavLink>
                    </motion.li>
                ))}
            </motion.ul>
        </NavUnlisted>
    );
};

export default Navigator;
