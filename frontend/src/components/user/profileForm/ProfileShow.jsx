import React from "react";
import UserService from "../../../services/userService";
import Swal from "sweetalert2";

const ProfileShow = ({ profile, user, setEditingProfile }) => {
    const { firstName, lastName, address, phone, birth, gender, work_start_date } = profile;
    const permissions = user.modify_profile_enabled;
    const { requestModifyPermission } = UserService();

    const handleChangeProfile = async () => {
        if (permissions) setEditingProfile(true);
        else {
            const message = await requestModifyPermission();
            Swal.fire({
                icon: "success",
                title: "Success",
                html: message,
            });
        }
    };
    return (
        <div className={permissions ? "profile__container" : "profile__container disabled"}>
            <h2>Profile</h2>

            <div className="field">
                <div className="detail">
                    <strong>First Name: </strong>
                    {firstName}
                </div>
                <div className="detail">
                    <strong>Last Name: </strong>
                    {lastName}
                </div>
                <div className="detail">
                    <strong>Address: </strong>
                    {address}
                </div>
                <div className="detail">
                    <strong>Phone: </strong>
                    {phone}
                </div>
                <div className="detail">
                    <strong>Birth: </strong>
                    {birth}
                </div>
                <div className="detail">
                    <strong>Gender: </strong>
                    {gender}
                </div>
                <div className="detail">
                    <strong>Work Start Date: </strong>
                    {work_start_date}
                </div>

                <button className="button-28" role="button" onClick={handleChangeProfile}>
                    {permissions ? "Change" : "Request"}
                </button>
            </div>
        </div>
    );
};

export default ProfileShow;
