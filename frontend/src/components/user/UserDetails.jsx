import React from "react";

import "../../assets/css/user/account.css";
import UserProfile from "./UserProfile";
import UserAccount from "./UserAccount";

const UserDetails = ({ direction, user }) => {
    if (direction === "left") {
        return <UserAccount user={user} />;
    } else if (direction === "right") {
        return <UserProfile user={user} />;
    }
};

export default UserDetails;
