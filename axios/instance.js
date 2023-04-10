import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://dummyjson.com/',
    timeout: 1000 * 60,
});

export default axiosInstance;