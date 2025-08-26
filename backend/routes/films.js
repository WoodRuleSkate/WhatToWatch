const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// GET /api/films - отримати всі фільми
router.get("/", async (req, res) => {
  try {
    const { genre, year } = req.query;

    let query = "SELECT * FROM films WHERE 1=1";
    const params = [];

    if (genre) {
      query += " AND genre = ?";
      params.push(genre);
    }

    if (year) {
      query += " AND release_year = ?";
      params.push(parseInt(year));
    }

    query += " ORDER BY id DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при отриманні фільмів" });
  }
});

// GET /api/films/:id - отримати один фільм за ID
router.get("/:id", async (req, res) => {
  try {
    const filmId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM films WHERE id = ?", [
      filmId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Фільм не знайдено" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при отриманні фільму" });
  }
});

// GET /api/films/:id/comments - отримати коментарі до фільму
router.get("/:id/comments", async (req, res) => {
  try {
    const filmId = req.params.id;

    const [rows] = await pool.query(
      `
      SELECT c.*, u.username 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.film_id = ?
      ORDER BY c.created_at DESC
    `,
      [filmId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при отриманні коментарів" });
  }
});

// POST /api/films/:id/comments - додати коментар до фільму
router.post("/:id/comments", async (req, res) => {
  try {
    const filmId = req.params.id;
    const { content } = req.body;
    const userId = 1;

    const [films] = await pool.query("SELECT * FROM films WHERE id = ?", [filmId]);
    if (films.length === 0) {
      return res.status(404).json({ message: "Film non trouvé" });
    }

    const [result] = await pool.query(
      "INSERT INTO comments (film_id, user_id, content) VALUES (?, ?, ?)",
      [filmId, userId, content]
    );

    const [comments] = await pool.query(
      `
      SELECT c.*, u.username 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `,
      [result.insertId]
    );

    res.status(201).json(comments[0]);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при додаванні коментаря" });
  }
});

// POST /api/films - створити новий фільм
router.post('/', async (req, res) => {
  try {
    const { title, release_year, genre, description, poster_url } = req.body;
    
    if (!title || !release_year || !genre || !description) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }
    
    const userId = 1;
    
    const [result] = await pool.query(
      'INSERT INTO films (title, release_year, genre, description, poster_url, added_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, release_year, genre, description, poster_url || '', userId]
    );
    
    const [films] = await pool.query('SELECT * FROM films WHERE id = ?', [result.insertId]);
    
    res.status(201).json(films[0]);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера при створенні фільму' });
  }
});

// PUT /api/films/:id - оновити фільм
router.put('/:id', async (req, res) => {
  try {
    const filmId = req.params.id;
    const { title, release_year, genre, description, poster_url } = req.body;
    
    if (!title || !release_year || !genre || !description) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }
    
    const [films] = await pool.query('SELECT * FROM films WHERE id = ?', [filmId]);
    if (films.length === 0) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }
    
    await pool.query(
      'UPDATE films SET title = ?, release_year = ?, genre = ?, description = ?, poster_url = ? WHERE id = ?',
      [title, release_year, genre, description, poster_url || '', filmId]
    );
    
    const [updatedFilms] = await pool.query('SELECT * FROM films WHERE id = ?', [filmId]);
    
    res.json(updatedFilms[0]);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера при оновленні фільму' });
  }
});

module.exports = router;