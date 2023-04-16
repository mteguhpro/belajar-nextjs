import axios from "axios";

const instanceAxios = axios.create({
    baseURL: 'https://dummyjson.com/',
    timeout: 1000 * 60,
});

// Add a request interceptor
instanceAxios.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (window.localStorage.getItem("jwtToken")) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem("jwtToken");
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instanceAxios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    if (error.response.request.status === 401 || error.response.request.status === 403) {
        alert(error.response.request.status + ' | ' + error.response?.data?.message)
        window.localStorage.removeItem("jwtToken");
        window.location.href = '/login' //BELUM MENEMUKAN ALTERNATIF SELAIN window.location. 
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instanceAxios;