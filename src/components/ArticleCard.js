import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns'; // Siz ishlatgan kutubxona saqlandi

// Rasm yo'q holatlar uchun vaqtinchalik rasm
const placeholderImage = 'https://via.placeholder.com/600x400.png?text=News';

const ArticleCard = ({ article }) => {
    // Karta butunlay bosiladigan bo'lishi uchun CardActionArea ishlatildi
    return (
        <CardActionArea component={RouterLink} to={`/articles/${article.slug}`} sx={{ height: '100%' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={article.featured_image || placeholderImage}
                    alt={article.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {article.excerpt}
                    </Typography>
                    {/* Sana formati sizning kodingizdagidek saqlandi */}
                    {article.published_at && (
                        <Typography variant="caption" color="text.secondary">
                            {format(parseISO(article.published_at), 'dd MMMM yyyy')}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </CardActionArea>
    );
};

export default ArticleCard;

