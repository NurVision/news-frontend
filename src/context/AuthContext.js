import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Token va user ma'lumotlarini state'da saqlaymiz
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null);
    const [user, setUser] = useState(() => localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : null);
    const [loading, setLoading] = useState(true); // Dastlabki tekshiruv uchun

    const loginUser = (tokens, userData) => {
        // Login bo'lganda ma'lumotlarni saqlaymiz
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setAuthTokens(tokens.access);
        setUser(userData);
    };

    const logoutUser = () => {
        // Chiqishda hamma narsani tozalaymiz
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        setAuthTokens(null);
        setUser(null);
    };

    useEffect(() => {
        // Ilova ilk ochilganda token yaroqliligini tekshirish
        if (authTokens) {
            const decodedUser = jwtDecode(authTokens);
            const isExpired = dayjs.unix(decodedUser.exp).diff(dayjs()) < 1;
            if (isExpired) {
                logoutUser(); // Agar token eskirgan bo'lsa, tizimdan chiqaramiz
            }
        }
        setLoading(false); // Tekshiruv tugadi
    }, [authTokens]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };
    
    // `loading` holati tugamaguncha hech narsa ko'rsatmaymiz
    // Bu "poyga holati"ni oldini oladi
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

// Bu hook orqali istalgan komponentdan auth ma'lumotlarini oson olamiz
export const useAuth = () => {
    return useContext(AuthContext);
};
