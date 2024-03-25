import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    timeout: 5000,
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response.status === 401 || error.response.status === 406) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            try {
                const response = await axios.post("/token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (error) {
                console.log("Failed to refresh access token:", error);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
