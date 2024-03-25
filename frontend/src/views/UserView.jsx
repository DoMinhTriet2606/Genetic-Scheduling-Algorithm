import React, { useState } from "react";
import SideNav from "../components/layouts/SideNav";
import { motion, AnimatePresence } from "framer-motion";

import "../assets/css/pages/user.css";
import Navigator from "../components/layouts/Navigator";
import Modal from "../components/layouts/Modal";
import { useSelector } from "react-redux";
import { authSelector } from "../features/authentication/authSlice";

const UserView = () => {
    const { user } = useSelector(authSelector);
    const cards = [
        {
            title: "Account",
            description: "Viewing username, email, user's role and changing password",
            content: user,
        },
        {
            title: "Profile",
            description:
                "Viewing and modifying user's information such as name, phone, address, gender,...",
            content: user,
        },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [modalDirection, setModalDirection] = useState(null); // Trạng thái hướng trượt của modal
    const [selectedContent, setSelectedContent] = useState(null);

    const toggleModal = (direction, content) => {
        setSelectedContent(content);
        setIsOpen(!isOpen);
        setModalDirection(direction); // Đặt hướng trượt cho modal
    };

    return (
        <div>
            <section className="page__container section">
                <Navigator />
                <div className="user__container">
                    <AnimatePresence>
                        {/* Sử dụng map để render từng thẻ card */}
                        {cards.map((card, index) => (
                            <motion.div
                                onClick={() =>
                                    toggleModal(index === 0 ? "left" : "right", card.content)
                                } // Xác định hướng trượt dựa trên index của card
                                key={index}
                                className="card"
                                initial={{ opacity: 0, y: 20 }} // Trạng thái ban đầu
                                animate={{ opacity: 1, y: 0 }} // Trạng thái khi hiển thị
                                exit={{ opacity: 0, y: 20 }} // Trạng thái khi ẩn đi
                                transition={{ duration: 0.5, delay: index * 0.2 }} // Delay cho mỗi thẻ card
                            >
                                <h1>{card.title}</h1>
                                <p>{card.description}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <Modal
                        isOpen={isOpen}
                        onClose={toggleModal}
                        direction={modalDirection}
                        content={selectedContent}
                    />
                </div>
            </section>
            <SideNav />
        </div>
    );
};

export default UserView;
