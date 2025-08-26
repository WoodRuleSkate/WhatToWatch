const mysql = require('mysql2/promise');
require('dotenv').config();

// Створення пулу підключень
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Функція для тестування підключення
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('БД підключена успішно!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Помилка підключення до БД:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};