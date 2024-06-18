import axios from 'axios';

const axiosHttp = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

axiosHttp.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        return {
            ...config,
            headers: {
                ...(token !== null && { Authorization: `Bearer ${token}` }),
                ...config.headers,
            },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

let notify403Error = null;

axiosHttp.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 403 && notify403Error) {
            notify403Error('error', 'You are not authorized to perform this action');
        }
        return Promise.reject(error);
    }
);

export const setNotify403Error = (notifyFunction) => {
    notify403Error = notifyFunction;
};

export default axiosHttp;