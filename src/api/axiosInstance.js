// src/api/axiosInstance.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // <-- O'ZGARTIRILGAN IMPORT
import dayjs from 'dayjs';

const baseURL = 'https://news.jprq.site/api/v1/';

let accessToken = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { Authorization: accessToken ? `Bearer ${accessToken}` : null },
});


axiosInstance.interceptors.request.use(async req => {
    accessToken = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
        
        // FUNKSIYA NOMI O'ZGARTIRILDI
        const user = jwtDecode(accessToken); 
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        
        if (!isExpired) {
            return req;
        }
        
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            const response = await axios.post(`${baseURL}token/refresh/`, {
                refresh: refreshToken
            });
            
            localStorage.setItem('access_token', response.data.access);
            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
        } catch (error) {
            console.log("Refresh token expired or invalid", error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }
    }
    
    return req;
});

export default axiosInstance;