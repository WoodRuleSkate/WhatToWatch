-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Films
CREATE TABLE IF NOT EXISTS films (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  release_year INT,
  genre VARCHAR(100),
  description TEXT,
  poster_url TEXT,
  added_by INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  film_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (film_id) REFERENCES films(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Тестові дані
INSERT INTO users (username, email, password) VALUES
  ('demo', 'demo@example.com', 'demo_pass');

INSERT INTO films (title, release_year, genre, description, poster_url, added_by)
VALUES
  ('Le Fabuleux Destin d''Amélie Poulain', 2001, 'Comédie', 'Une jeune serveuse décide de changer la vie de ceux qui l''entourent.', 'https://via.placeholder.com/300x450?text=Amelie', 1),
  ('Inception', 2010, 'Science-fiction', 'Un voleur s''introduit dans les rêves pour voler des secrets.', 'https://via.placeholder.com/300x450?text=Inception', 1);
  