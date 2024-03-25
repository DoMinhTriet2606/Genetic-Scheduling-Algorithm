import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import "../../assets/css/layouts/modal.css";
import "../../assets/css/layouts/button.css";
import UserDetails from "../user/UserDetails";

const Modal = ({ isOpen, onClose, direction, content }) => {
    const handleOverlayClick = (event) => {
        if (event.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        className={`modal-content ${direction}`} // Thêm class direction vào modal-content
                        initial={{ scale: 0.5, x: direction === "left" ? "-100vw" : "100vw" }} // Di chuyển modal ra khỏi màn hình theo hướng tương ứng
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0.5, x: direction === "left" ? "-100vw" : "100vw" }}
                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                        <UserDetails direction={direction} user={content} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
