import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

// MUI komponentlarini import qilamiz
import {
    Container,
    Box,
    Avatar,
    Typography,
    TextField,
    Grid,
    Link,
    Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser } = useAuth();

    // Register sahifasidan kelgan xabarni olish
    const registrationMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // SIZNING API MANZILINGIZ
            const response = await axiosInstance.post('users/login/', {
                username,
                password,
            });

            const { access, refresh, user } = response.data;
            
            // AuthContext orqali ma'lumotlarni saqlash
            loginUser({ access, refresh }, user);
            
            navigate('/'); // Bosh sahifaga o'tish

        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                setError(err.response.data.detail || 'Foydalanuvchi nomi yoki parol xato.');
            } else {
                setError('Tizimga kirishda noma\'lum xatolik yuz berdi.');
            }
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Kirish
                </Typography>

                {/* Ro'yxatdan o'tgandan keyingi xabar */}
                {registrationMessage && !error && (
                    <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                        {registrationMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Foydalanuvchi nomi"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Parol"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Kirish
                    </LoadingButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Hisobingiz yo'qmi? Ro'yxatdan o'tish"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;

