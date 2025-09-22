import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post("http://localhost:8000/api/auth/refresh", {}, {withCredentials: true});
                localStorage.setItem("accessToken", data.accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error(err);
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;