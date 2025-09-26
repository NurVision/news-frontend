import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Box, Typography, CircularProgress, Alert, Container, Divider, Chip, Avatar } from '@mui/material';
import { format, parseISO } from 'date-fns';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`article/articles/${slug}/`);
                setArticle(response.data);
                setError('');
            } catch (err) {
                setError('Maqolani yuklashda xatolik yuz berdi.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

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

    if (!article) {
        return <Alert severity="info">Maqola topilmadi.</Alert>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h3" component="h1" gutterBottom sx={{ wordBreak: 'break-word' }}>
                {article.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                    {/* XATOLIK TUZATILGAN QATOR */}
                    {article.author?.username ? article.author.username.charAt(0).toUpperCase() : '?'}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" component="p">
                        {article.author?.username || 'Noma\'lum muallif'} 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {article.published_at ? format(parseISO(article.published_at), 'dd MMMM yyyy') : ''}
                    </Typography>
                </Box>
            </Box>

            {article.featured_image && (
                <Box
                    component="img"
                    src={article.featured_image}
                    alt={article.title}
                    sx={{
                        width: '100%',
                        maxHeight: '450px',
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 3
                    }}
                />
            )}
            
            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: article.content }} sx={{ lineHeight: 1.8, fontSize: '1.1rem' }} />

            <Divider sx={{ my: 3 }} />

            {article.tags && article.tags.length > 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom>Teglar:</Typography>
                    {article.tags.map(tag => (
                        <Chip 
                            key={tag.id} 
                            label={tag.name} 
                            component={RouterLink}
                            to={`/tags/${tag.slug}`}
                            clickable
                            sx={{ mr: 1, mb: 1 }} 
                        />
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default ArticleDetail;