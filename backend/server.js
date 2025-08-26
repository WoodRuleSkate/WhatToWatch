const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Імпорт модулів
const { testConnection } = require('./config/db');
const filmsRouter = require('./routes/films');
const { router: authRouter } = require('./routes/auth');

// Ініціалізація Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Тестування підключення до бази даних при старті
testConnection();

// Базовий маршрут для перевірки роботи API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API працює' });
});

// Жанри фільмів (статичні дані для фільтрації)
app.get('/api/genres', (req, res) => {
  const genres = [
    'Comédie', 'Drame', 'Action', 'Aventure', 'Thriller', 
    'Horreur', 'Romance', 'Science-fiction', 'Fantaisie', 'Historique',
    'Biographique', 'Policier', 'Musique', 'Western', 'Guerre',
    'Documentaire', 'Crime', 'Animation', 'Familial'
  ];
  res.json(genres);
});

// Маршрути API
app.use('/api/films', filmsRouter);
app.use('/api/auth', authRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});