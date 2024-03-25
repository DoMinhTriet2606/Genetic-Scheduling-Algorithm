import React from "react";
import UserProfileForm from "./UserProfile";

import "../../assets/css/user/account.css";
import Swal from "sweetalert2";
import AuthService from "../../services/authService";

const UserAccount = ({ user }) => {
    const { changePassword, logoutUser } = AuthService();

    const handleChangePassword = () => {
        Swal.fire({
            title: "Changing Password",
            html: `
    <input id="swal-input1" class="swal2-input" type="password" placeholder="Old Password">
    <input id="swal-input2" class="swal2-input" type="password" placeholder="New Password">
    <input id="swal-input3" class="swal2-input" type="password" placeholder="Confirm New Password">
  `,
            focusConfirm: false,
            preConfirm: () => {
                const password1 = document.getElementById("swal-input1").value;
                const password2 = document.getElementById("swal-input2").value;
                const password3 = document.getElementById("swal-input3").value;

                return {
                    oldPassword: password1,
                    newPassword: password2,
                    confirmNewPassword: password3,
                };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const responseData = await changePassword(result.value);
                console.log(responseData);
                if (responseData.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        html: responseData.message + "<br> Please login again to continue",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            logoutUser();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                    });
                }
            }
        });
    };

    return (
        <div className="user-details">
            <h2>Account</h2>
            <div className="field account">
                <div className="detail">
                    <strong>Username:</strong> {user.username}
                </div>
                <div className="detail">
                    <strong>Email:</strong> {user.email}
                </div>
                <div className="detail">
                    <strong>Account Type:</strong> {user.account_type}
                </div>
                <div className="detail">
                    <strong>Created Date:</strong> {user.created_date}
                </div>

                <div className="permission">
                    <strong>Permission:</strong>{" "}
                    <span className={user.modify_profile_enabled ? "access" : ""}></span>
                </div>
                <div className="mt-12">
                    <button className="button-28" onClick={handleChangePassword}>
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAccount;
