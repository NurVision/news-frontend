import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
// YUKLANISH HOLATI UCHUN MAXSUS TUGMA
import { LoadingButton } from '@mui/lab';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (password !== password2) {
            setError("Parollar bir xil emas!");
            setLoading(false);
            return;
        }

        try {
            // SIZNING API MANZILINGIZ
            await axiosInstance.post('users/register/', {
                username,
                email,
                password,
                password2,
            });
            navigate('/login', { state: { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi tizimga kirishingiz mumkin." } });

        } catch (err) {
            if (err.response && err.response.data) {
                const errors = err.response.data;
                const errorMessages = Object.values(errors).flat().join(' ');
                setError(errorMessages || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.');
            } else if (err.request) {
                setError('Server bilan bog\'lanib bo\'lmadi. Internet aloqasini tekshiring.');
            } else {
                setError('Ro\'yxatdan o\'tishda noma\'lum xatolik yuz berdi.');
            }
            console.error(err);
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
                    <PersonAddAlt1Icon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Ro'yxatdan o'tish
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2, whiteSpace: 'pre-wrap' }}>{error}</Alert>}
                    
                    {/* --- O'ZGARISH QILINDI: GRID O'RNIGA MARGIN ISHLATILDI --- */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Foydalanuvchi nomi"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Manzil"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Parol"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Parolni tasdiqlang"
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Ro'yxatdan o'tish
                    </LoadingButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Allaqachon hisobingiz bormi? Kirish
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;

