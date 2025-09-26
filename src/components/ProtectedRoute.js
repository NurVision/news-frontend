import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // <-- Outlet'ni import qilamiz
import { useAuth } from '../context/AuthContext';    // <-- Menejerni chaqiramiz

const ProtectedRoute = () => {
    const { user } = useAuth(); // <-- Menejerdan 'user' ma'lumotini olamiz

    // 1-tekshiruv: Foydalanuvchi tizimga umuman kirmaganmi?
    if (!user) {
        // Agar 'user' yo'q bo'lsa (null yoki undefined), Login sahifasiga yo'naltiramiz
        return <Navigate to="/login" />;
    }

    // 2-tekshiruv: Foydalanuvchining roli to'g'ri keladimi?
    // Rollarni oldin kelishganimizdek KATTA HARFLARDA tekshiramiz.
    if (user.role === 'ADMIN' || user.role === 'EDITOR') {
        // Agar roli to'g'ri kelsa, unga so'ralgan sahifani ko'rsatamiz.
        // <Outlet /> - bu App.jsx'dagi o'ralgan Route'ni (masalan, <CreateArticlePage/>) anglatadi.
        return <Outlet />;
    } else {
        // Agar foydalanuvchi tizimga kirgan, lekin roli to'g'ri kelmasa (masalan, READER),
        // uni Bosh sahifaga yo'naltiramiz.
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;