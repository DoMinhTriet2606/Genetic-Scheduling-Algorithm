import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../../features/authentication/authSlice";
import { profileSelector } from "../../features/profile/profileSlice";
import ProfileFill from "./profileForm/ProfileFill";
import ProfileFilled from "./profileForm/ProfileFilled";
import ProfileShow from "./profileForm/ProfileShow";

import UserService from "../../services/userService";

const UserProfile = () => {
    const { getProfile } = UserService();
    const { user } = useSelector(authSelector);
    const { userProfile, profileLoading } = useSelector(profileSelector);
    const [editingProfile, setEditingProfile] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);

    let body = null;

    if (profileLoading) {
        body = <h1>Loading...</h1>;
    } else if (userProfile === null) body = <ProfileFill user={user} />;
    else if (editingProfile)
        body = <ProfileFilled profile={userProfile} setEditingProfile={setEditingProfile} />;
    else
        body = (
            <ProfileShow setEditingProfile={setEditingProfile} profile={userProfile} user={user} />
        );

    return <>{body}</>;
};

export default UserProfile;
