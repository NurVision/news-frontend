import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

import {
    Container, Box, Typography, TextField, Button, Grid,
    CircularProgress, Alert, Paper, FormControl, InputLabel,
    Select, MenuItem, Autocomplete, Chip, Link
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const EditArticle = () => {
    // Form state'lari
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    
    // Ro'yxatlar uchun state'lar
    const [categories, setCategories] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    
    // Yordamchi state'lar
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const { id } = useParams();   // ✅ Faqat id ni olamiz
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articleRes, categoriesRes, tagsRes] = await Promise.all([
                    axiosInstance.get(`article/editor/articles/${id}/`),   // ✅ id ishlatyapmiz
                    axiosInstance.get('article/categories/'),
                    axiosInstance.get('article/tags/')
                ]);

                const articleData = articleRes.data;
                const categoryData = categoriesRes.data.results || categoriesRes.data;
                const tagData = tagsRes.data.results || tagsRes.data;

                // Formani to‘ldiramiz
                setTitle(articleData.title);
                setContent(articleData.content);
                setExcerpt(articleData.excerpt);
                setCategory(articleData.category.id);
                setCurrentImageUrl(articleData.featured_image);

                const currentTags = articleData.tags.map(tag => tag.name);
                setSelectedTags(currentTags);

                setCategories(categoryData);
                const allTagNames = tagData.map(tag => tag.name);
                setTagOptions(allTagNames);

            } catch (error) {
                setError("Ma'lumotlarni yuklab bo'lmadi.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);  // ✅ id ga bog'ladik

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('excerpt', excerpt);
        formData.append('category', category);
        
        if (image) {
            formData.append('featured_image', image);
        }

        selectedTags.forEach(tag => {
            formData.append('tags', tag);
        });

        try {
            await axiosInstance.patch(`article/editor/articles/${id}/`, formData, {  // ✅ id ishlatyapmiz
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/my-articles'); 
        } catch (err) {
            setError('Maqolani yangilashda xatolik yuz berdi.');
            console.error(err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !error) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Maqolani Tahrirlash
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    <TextField label="Sarlavha" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" fullWidth required />
                    <TextField label="Qisqacha mazmun (Excerpt)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} margin="normal" fullWidth required multiline rows={3} />
                    <TextField label="Maqola Matni" value={content} onChange={(e) => setContent(e.target.value)} margin="normal" fullWidth required multiline rows={12} />
                    
                    {/* --- QOLIB KETGAN QISMLAR --- */}

                    {/* Kategoriya tanlash */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-select-label">Kategoriya</InputLabel>
                        <Select
                            labelId="category-select-label"
                            value={category}
                            label="Kategoriya"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Teglarni tanlash */}
                    <Autocomplete
                        multiple
                        id="tags-autocomplete"
                        options={tagOptions}
                        value={selectedTags}
                        onChange={(event, newValue) => {
                            setSelectedTags(newValue);
                        }}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Teglar"
                                placeholder="Teglarni qo'shing"
                            />
                        )}
                        sx={{ my: 2 }}
                    />
                    
                    {/* Rasm yuklash */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                                Rasm Yuklash
                                <input type="file" hidden onChange={handleImageChange} />
                            </Button>
                        </Grid>
                        <Grid item>
                            {image ? (
                                <Typography variant="body2">{image.name}</Typography>
                            ) : (
                                currentImageUrl && (
                                    <Link href={currentImageUrl} target="_blank" rel="noopener">
                                        Joriy rasmni ko'rish
                                    </Link>
                                )
                            )}
                        </Grid>
                    </Grid>

                    {/* ENG ASOSIYSI - SAQLASH TUGMASI */}
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={loading}
                        fullWidth
                        sx={{ mt: 3, mb: 2 }}
                    >
                        O'zgarishlarni Saqlash
                    </LoadingButton>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditArticle;
