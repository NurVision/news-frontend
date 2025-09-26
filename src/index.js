// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';
import './styles/components.css';

// MUI'dan kerakli funksiyalarni import qilamiz
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// MUI uchun standart yoki o'zingizning maxsus temangizni yaratasiz
// Hozircha bo'sh tema yaratamiz, bu standart dizaynni ishlatadi
const theme = createTheme({
  // Kelajakda shu yerga o'z ranglaringizni, shriftlaringizni qo'shasiz
  // palette: {
  //   primary: {
  //     main: '#1976d2',
  //   },
  // },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {/* ThemeProvider butun ilovani o'rashi kerak */}
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Stillarni normallashtirish uchun */}
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);