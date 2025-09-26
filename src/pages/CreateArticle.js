import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

// MUI komponentlarini import qilamiz
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const CreateArticle = () => {
    // Form state'lari (sizning kodingizdan olingan)
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // body -> content ga o'zgartirildi
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);

    // Ro'yxatlar uchun state'lar
    const [categories, setCategories] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    // Yordamchi state'lar
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoriesRes, tagsRes] = await Promise.all([
                    axiosInstance.get('article/categories/'),
                    axiosInstance.get('article/tags/')
                ]);

                const categoryData = categoriesRes.data.results || categoriesRes.data;
                setCategories(categoryData);
                if (categoryData.length > 0) {
                    setCategory(categoryData[0].id); // Birinchi kategoriyani standart tanlash
                }

                const tagData = tagsRes.data.results || tagsRes.data;
                const allTagNames = tagData.map(tag => tag.name);
                setTagOptions(allTagNames);

            } catch (err) {
                setError("Kategoriya va teglarni yuklashda xatolik yuz berdi.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
            await axiosInstance.post('article/editor/articles/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/my-articles');
        } catch (err) {
            setError('Maqola yaratishda xatolik yuz berdi. Barcha maydonlar to\'ldirilganini tekshiring.');
            console.error(err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading && categories.length === 0) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Yangi Maqola Yaratish
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    <TextField
                        label="Sarlavha"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        fullWidth
                        required
                    />
                    
                    <TextField
                        label="Qisqacha mazmun (Excerpt)"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        rows={3}
                    />

                    <TextField
                        label="Maqola Matni"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        rows={12}
                    />
                    
                    <Grid container spacing={2} sx={{ my: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="category-select-label">Kategoriya</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    value={category}
                                    label="Kategoriya"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, height: '100%' }}>
                                <Typography variant="subtitle2" gutterBottom>Maqola Rasmi</Typography>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                >
                                    Rasm tanlash
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </Button>
                                {image && <Typography variant="caption" sx={{ ml: 2, display: 'block', mt:1 }}>{image.name}</Typography>}
                            </Box>
                        </Grid>
                    </Grid>

                    <Autocomplete
                        multiple
                        freeSolo
                        options={tagOptions}
                        value={selectedTags}
                        onChange={(event, newValue) => {
                            setSelectedTags(newValue);
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Teglar (yangi teg qo'shish uchun yozib Enter'ni bosing)"
                                placeholder="Teglar"
                                margin="normal"
                            />
                        )}
                    />
                    
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={loading}
                        sx={{ mt: 3 }}
                    >
                        Yaratish
                    </LoadingButton>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateArticle;
