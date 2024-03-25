import axios from "./axios";

import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../features/profile/profileSlice";

const UserService = () => {
    const dispatch = useDispatch();

    const getProfile = async () => {
        try {
            const response = await axios.get("user/get_profile/");
            if (response.data.success) {
                dispatch(fetchUserProfile(response.data.profile));
            }
        } catch (error) {
            console.log(error.response.data);
            dispatch(fetchUserProfile(null));
        }
    };

    const addProfile = async (profile) => {
        try {
            const response = await axios.post("user/create_profile/", profile);
            if (response.data.success) {
                dispatch(fetchUserProfile(response.data.profile));
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };

    const updateProfile = async (profile) => {
        try {
            const response = await axios.put("user/staff_modify_profile/", profile);
            if (response.data.success) {
                dispatch(fetchUserProfile(response.data.profile));
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };

    const requestModifyPermission = async () => {
        try {
            const response = await axios.post("user/request_modify_permission/");
            return response.data.message;
        } catch (error) {
            return error.response.data;
        }
    };

    return { getProfile, addProfile, updateProfile, requestModifyPermission };
};

export default UserService;
