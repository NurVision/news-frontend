import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

// MUI komponentlarini import qilamiz
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const MyArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // O'chirishni tasdiqlash uchun Dialog (modal) state'i
    const [openDialog, setOpenDialog] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    useEffect(() => {
        const fetchMyArticles = async () => {
            try {
                const response = await axiosInstance.get('article/editor/articles/');
                setArticles(response.data.results || response.data);
                setError('');
            } catch (err) {
                setError('Maqolalarni yuklashda xatolik yuz berdi.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyArticles();
    }, []);

    // Dialog'ni ochish
    const handleDeleteClick = (articleId) => {
        setArticleToDelete(articleId);
        setOpenDialog(true);
    };

    // Dialog'ni yopish
    const handleDialogClose = () => {
        setOpenDialog(false);
        setArticleToDelete(null);
    };

    // O'chirishni tasdiqlash
    const confirmDelete = async () => {
        if (!articleToDelete) return;
        try {
            await axiosInstance.delete(`article/editor/articles/${articleToDelete}/`);
            setArticles(articles.filter(article => article.id !== articleToDelete));
        } catch (err) {
            setError(`Maqolani (ID: ${articleToDelete}) o'chirishda xatolik yuz berdi.`);
        } finally {
            handleDialogClose();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Container maxWidth="lg">
            {/* O'chirishni tasdiqlash uchun Dialog oynasi */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
            >
                <DialogTitle>O'chirishni tasdiqlash</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Haqiqatan ham ushbu maqolani o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Bekor qilish</Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Ha, o'chirish
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Mening Maqolalarim
                </Typography>
                <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/create-article"
                    startIcon={<AddIcon />}
                >
                    Maqola Yaratish
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {articles.length === 0 && !loading ? (
                <Alert severity="info">Siz hali maqola yaratmadingiz.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {articles.map(article => (
                        <Grid item key={article.id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                           <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.excerpt || '...'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        size="small" 
                                        component={RouterLink} 
                                        // --- MANA SHU YERNI DIQQAT BILAN TEKSHIRING ---
                                        to={`/edit-article/${article.id}`}
                                        startIcon={<EditIcon />}
                                    >
                                        Tahrirlash
                                    </Button>
                                    <Button 
                                        size="small" 
                                        color="error"
                                        onClick={() => handleDeleteClick(article.id)}
                                        startIcon={<DeleteIcon />}
                                    >
                                        O'chirish
                                    </Button>
                                </CardActions>
                           </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyArticles;

