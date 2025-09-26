import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Qo'riqchimiz
import PublicRoute from './components/PublicRoute';     // <-- Mehmonlar uchun tekshiruvchi

// Barcha sahifalarni import qilamiz
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import MyArticles from './pages/MyArticles';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticlesByTagPage from './pages/ArticlesByTagPage';
import ArticlesByCategoryPage from './pages/ArticlesByCategoryPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 1. Ochiq sahifalar (hamma uchun) */}
          <Route path="/" element={<Home />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/tags/:slug" element={<ArticlesByTagPage />} />
          <Route path="/category/:slug" element={<ArticlesByCategoryPage />} />

          {/* 2. Faqat mehmonlar uchun sahifalar GURUHI */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 3. Himoyalangan sahifalar GURUHI (faqat ADMIN va EDITOR uchun) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
            {/* Kelajakda boshqa himoyalangan sahifalar shu yerga qo'shiladi */}
          </Route>

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;