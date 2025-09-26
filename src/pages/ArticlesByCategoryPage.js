import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ArticleCard from '../components/ArticleCard'; // Bosh sahifadagi kartochkani qayta ishlatamiz

// MUI komponentlarini import qilamiz
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';

const ArticlesByCategoryPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { slug } = useParams(); 
    
    // Layout'dagi NavLink'dan yuborilgan kategoriya nomini olish uchun
    const location = useLocation();
    const categoryName = location.state?.categoryName;

    useEffect(() => {
        const fetchArticlesByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`article/categories/${slug}/articles/`);
                setArticles(response.data.results || response.data);
            } catch (err) {
                setError("Maqolarni yuklashda xatolik yuz berdi.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // slug mavjud bo'lsagina ma'lumotlarni yuklaymiz
        if (slug) {
            fetchArticlesByCategory();
        }
    }, [slug]); // Har safar URL'dagi slug o'zgarganda, ma'lumotlarni qayta yuklaydi

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
                {/* Agar kategoriya nomi bo'lsa, uni ko'rsatamiz */}
                {categoryName ? `'${categoryName}' yangiliklar` : 'Maqolalar'}
            </Typography>
            
            {articles.length > 0 ? (
                <Grid container spacing={3}>
                    {articles.map(article => (
                        <Grid item key={article.id} xs={12} sm={6} md={4}>
                            <ArticleCard article={article} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info">Bu kategoriyada hali maqolalar mavjud emas.</Alert>
            )}
        </Container>
    );
};

export default ArticlesByCategoryPage;

