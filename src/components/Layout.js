import React, { useState, useEffect } from 'react';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

// MUI komponentlarini import qilamiz
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Paper,
    Menu,
    MenuItem,
    IconButton,
    Avatar
} from '@mui/material';


const Layout = ({ children }) => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    // Foydalanuvchi menyusi uchun state
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('article/categories/');
                setCategories(response.data.results || response.data);
            } catch (error) {
                console.error("Kategoriyalarni yuklashda xatolik:", error.response.data);
            }
        };
        fetchCategories();
    }, []);

    // Menyu bilan ishlash funksiyalari
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logoutUser();
        navigate('/login');
    };
    
    // Foydalanuvchi menyusi
    const renderUserMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={RouterLink} to="/my-articles" onClick={handleMenuClose}>Mening Maqolalarim</MenuItem>
            <MenuItem component={RouterLink} to="/create-article" onClick={handleMenuClose}>Maqola Yaratish</MenuItem>
            <MenuItem onClick={handleLogout}>Chiqish</MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* 1. ASOSIY NAVIGATSIYA (HEADER) */}
            <AppBar position="static">
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                flexGrow: 1,
                                color: 'inherit',
                                textDecoration: 'none',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                            }}
                        >
                            NewsSite
                        </Typography>

                        {/* Foydalanuvchi tizimda bo'lsa */}
                        {user ? (
                            <Box>
                                <Button component={NavLink} to="/" color="inherit">Bosh Sahifa</Button>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Box>
                        ) : (
                            // Foydalanuvchi tizimda bo'lmasa
                            <Box>
                                <Button component={NavLink} to="/" color="inherit">Bosh Sahifa</Button>
                                <Button component={NavLink} to="/login" color="inherit">Kirish</Button>
                                <Button component={NavLink} to="/register" color="inherit">Ro'yxatdan o'tish</Button>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            {renderUserMenu}

            {/* 2. KATEGORIYALAR NAVIGATSIYASI */}
            <Paper elevation={1} sx={{ mt: 1 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', p: 1 }}>
                        {categories.map(category => (
                            <Button
                                key={category.id}
                                component={NavLink}
                                to={`/category/${category.slug}`}
                                state={{ categoryName: category.name }}
                                sx={{ 
                                    my: 1, 
                                    mx: 1,
                                    '&.active': {
                                        backgroundColor: 'action.selected',
                                        fontWeight: 'bold'
                                    }
                                }}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </Box>
                </Container>
            </Paper>

            {/* 3. ASOSIY KONTENT */}
            <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {children}
            </Container>

            {/* 4. FOOTER */}
            <Box component="footer" sx={{
                py: 3, px: 2, mt: 'auto',
                backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            }}>
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <RouterLink color="inherit" to="/">
                            NewsSite
                        </RouterLink>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;

