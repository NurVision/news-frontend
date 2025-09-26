import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ArticleCard from '../components/ArticleCard'; // ArticleCard komponenti

// MUI komponentlarini import qilamiz
import { Grid, CircularProgress, Typography, Alert, Box } from '@mui/material';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axiosInstance.get('article/articles/');
                setArticles(response.data.results || response.data);
                setError('');
            } catch (err) {
                setError('Maqolalarni yuklashda xatolik yuz berdi.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                So'nggi Maqolalar
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
                <Alert severity="info">Hozircha maqolalar mavjud emas.</Alert>
            )}
        </Box>
    );
};

export default Home;

