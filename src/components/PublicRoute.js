import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // <-- Outlet import qilindi
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => { // <-- props'dan 'children' olib tashlandi
    const { user } = useAuth(); // "Menejer"dan foydalanuvchi ma'lumotini olamiz

    if (user) {
        // Agar foydalanuvchi tizimga kirgan bo'lsa, uni Bosh Sahifaga yo'naltiramiz
        return <Navigate to="/" />;
    }

    // Agar tizimga kirmagan bo'lsa, so'ralgan sahifani (Login yoki Register) ko'rsatamiz
    return <Outlet />; // <-- 'children' o'rniga <Outlet /> ishlatamiz
};

export default PublicRoute;