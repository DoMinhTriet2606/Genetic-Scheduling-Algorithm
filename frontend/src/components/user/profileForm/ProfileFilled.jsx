import Input from "../../layouts/Input";
import "../../../assets/css/user/profile-form.css";
import Swal from "sweetalert2";

import React, { useState } from "react";
import UserService from "../../../services/userService";

const ProfileFilled = ({ profile, setEditingProfile }) => {
    // State
    const [newProfile, setNewProfile] = useState(profile);

    const { updateProfile } = UserService();

    const { firstName, lastName, address, phone, birth, work_start_date } = newProfile;

    const onChangeNewProfileForm = (event) => {
        setNewProfile({ ...newProfile, [event.target.name]: event.target.value });
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "After modified the information, you can not modify again until you have permission from Manager",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, modify it!",
        });

        if (result.isConfirmed) {
            await updateProfile(newProfile);
            setEditingProfile(false);
        }
    };

    return (
        <div className="profile__container">
            <h2>Profile</h2>

            <form onSubmit={onSubmit}>
                <div className="field">
                    <Input
                        field="First Name"
                        name="firstName"
                        type="text"
                        value={firstName}
                        onChange={onChangeNewProfileForm}
                    />
                    <Input
                        field="Last Name"
                        name="lastName"
                        type="text"
                        value={lastName}
                        onChange={onChangeNewProfileForm}
                    />

                    <Input
                        field="Address"
                        name="address"
                        type="text"
                        value={address}
                        onChange={onChangeNewProfileForm}
                    />

                    <Input
                        field="Phone"
                        name="phone"
                        type="text"
                        value={phone}
                        onChange={onChangeNewProfileForm}
                    />

                    <Input
                        field="Work Start Date"
                        name="work_start_date"
                        type="text"
                        value={work_start_date}
                        onChange={onChangeNewProfileForm}
                    />

                    <div className="birth-field">
                        <label htmlFor="dateofbirth">Date Of Birth</label>
                        <input
                            type="date"
                            name="birth"
                            id="dateofbirth"
                            required
                            value={birth}
                            onChange={onChangeNewProfileForm}
                        />
                    </div>

                    <div className="gender-field">
                        <div className="label-name">Gender</div>
                        <div className="container-radio">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    onChange={onChangeNewProfileForm}
                                />
                                <span>Male</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    onChange={onChangeNewProfileForm}
                                />
                                <span>Female</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="secret"
                                    onChange={onChangeNewProfileForm}
                                />
                                <span>Secret</span>
                            </label>
                        </div>
                    </div>

                    <div className="submit-button">
                        <input className="button-28" role="button" type="submit" value="Save" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileFilled;
