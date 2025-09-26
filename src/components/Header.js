import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // axiosInstance to'g'ri import qilinganiga ishonch hosil qiling
import './Header.css';

const Header = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Kategoriyalarni yuklash uchun API so'rovi
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('article/categories/');
                setCategories(response.data.results || response.data);
            } catch (error) {
                console.error("Kategoriyalarni yuklashda xatolik:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <header className="site-header">
            {/* 1. Asosiy Menyu */}
            <nav className="main-navbar">
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <Link to="/">NewsSite</Link>
                    </div>
                    <div className="navbar-menu-right">
                        <Link to="/my-articles" className="nav-link">Mening Maqolalarim</Link>
                        <Link to="/create-article" className="nav-link cta-button">Maqola Yaratish</Link>
                        {/* Kelajakda "Logout" yoki "Profile" tugmalari uchun joy */}
                    </div>
                </div>
            </nav>

            {/* 2. Kategoriyalar Menyusi */}
            <nav className="category-navbar">
                <div className="navbar-container">
                    {categories.map(category => (
                        <NavLink 
                            key={category.id} 
                            to={`/category/${category.id}`} // Yoki slug bo'lsa: `/category/${category.slug}`
                            className="category-link"
                        >
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;