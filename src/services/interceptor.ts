import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Axios request interceptor to add authentication token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access-token'); // Assuming you store the access token in localStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;