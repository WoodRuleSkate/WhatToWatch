/**
 * Comment interface defines the structure of comments for films
 * Інтерфейс Comment визначає структуру коментарів до фільмів
 */
export interface Comment {
  id: number;           // Comment ID / ID коментаря
  film_id: number;      // ID of the film this comment belongs to / ID фільму, до якого відноситься коментар
  user_id: number;      // ID of the user who wrote this comment / ID користувача, який написав коментар
  content: string;      // Comment content / Зміст коментаря
  created_at: string;   // Date and time when comment was created / Дата і час створення коментаря
  username?: string;    // Username (optional, may be fetched separately) / Ім'я користувача (необов'язкове)
}
