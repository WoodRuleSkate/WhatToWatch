const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// ЗМІНА: додаємо bcrypt для хешування/перевірки паролів
const bcrypt = require('bcrypt'); // ЗМІНА

// Функція перевірки авторизації 
const isAuthenticated = (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).json({ message: 'Необхідна авторизація' });
  }
};

// POST /api/auth/login - вхід користувача
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ЗМІНА: спочатку знаходимо користувача тільки за email (без порівняння пароля в SQL)
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ); // ЗМІНА: змінив SQL і параметри

    if (users.length === 0) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    const user = users[0];

    // ЗМІНА: порівнюємо переданий пароль із хешем у БД
    const isMatch = await bcrypt.compare(password, user.password); // ЗМІНА
    if (!isMatch) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    // Залишаємо як є: не повертаємо пароль
    delete user.password;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: 'simple-auth-token'
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера при авторизації' });
  }
});

// POST /api/auth/register - реєстрація нового користувача
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Усі поля обов\'язкові' });
    }

    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Користувач з таким email або ім\'ям вже існує' });
    }

    // ЗМІНА: хешуємо пароль перед збереженням
    const passwordHash = await bcrypt.hash(password, 10); // ЗМІНА

    // ЗМІНА: записуємо в БД хеш (а не відкритий пароль)
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, passwordHash] // ЗМІНА
    );

    res.status(201).json({
      id: result.insertId,
      username,
      email,
      message: 'Користувач успішно зареєстрований'
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера при реєстрації' });
  }
});

// GET /api/auth/check - перевірка авторизації
router.get('/check', isAuthenticated, (req, res) => {
  res.json({ authenticated: true });
});

module.exports = {
  router,
  isAuthenticated
};