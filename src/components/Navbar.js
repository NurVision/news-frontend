// src/components/Navbar.js

import React from 'react';
// React Router DOM'dan Link'ni 'RouterLink' nomi bilan chaqiramiz (MUI Link bilan adashmaslik uchun)
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// MUI komponentlarini import qilamiz
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        // <nav> o'rniga MUI AppBar'dan foydalanamiz
        <AppBar position="static">
            <Toolbar>
                {/* Sarlavha (Brend nomi) */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        News Website
                    </RouterLink>
                </Typography>

                {/* Menyudagi havolalar va tugmalar uchun Box */}
                <Box>
                    <Button color="inherit" component={RouterLink} to="/">
                        Bosh sahifa
                    </Button>

                    {user ? (
                        // Foydalanuvchi tizimda bo'lsa
                        <>
                            {(user.role === 'ADMIN' || user.role === 'EDITOR') && (
                                <>
                                    <Button color="inherit" component={RouterLink} to="/my-articles">
                                        Mening Maqolalarim
                                    </Button>
                                    <Button color="inherit" component={RouterLink} to="/create-article">
                                        Maqola Yaratish
                                    </Button>
                                </>
                            )}
                            <Button color="inherit" onClick={handleLogout}>
                                Chiqish ({user.username})
                            </Button>
                        </>
                    ) : (
                        // Foydalanuvchi mehmon bo'lsa
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">
                                Kirish
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/register">
                                Ro'yxatdan o'tish
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;