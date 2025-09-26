import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { format, parseISO } from 'date-fns';
import './Home.css'; // Bosh sahifa stillarini qayta ishlatamiz

const ArticlesByTagPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams(); // URL'dan tegning slug'ini olamiz

    useEffect(() => {
        const fetchArticlesByTag = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axiosInstance.get(`article/tags/${slug}/articles/`);
                setArticles(response.data.results || response.data);
            } catch (err) {
                setError(`'${slug}' tegi bo'yicha maqolalarni yuklashda xatolik yuz berdi.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticlesByTag();
        }
    }, [slug]); // Har safar slug o'zgarganda qayta ishga tushadi

    if (loading) {
        return <div className="loader">Yuklanmoqda...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1 className="page-title">
                <span className="page-subtitle">Teg:</span> {slug}
            </h1>

            {articles.length > 0 ? (
                <div className="article-grid">
                    {articles.map(article => (
                        <div key={article.id} className="article-card">
                            <Link to={`/articles/${article.slug}`} className="article-card-link">
                                {article.featured_image && (
                                    <img src={article.featured_image} alt={article.title} className="article-card-image" />
                                )}
                                <div className="article-card-content">
                                    <h2 className="article-card-title">{article.title}</h2>
                                    <p className="article-card-excerpt">{article.excerpt}</p>
                                    {article.published_at && (
                                        <p className="article-card-date">
                                            {format(parseISO(article.published_at), 'dd MMMM yyyy')}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>Bu teg bo'yicha hali maqolalar mavjud emas.</p>
            )}
        </div>
    );
};

export default ArticlesByTagPage;

