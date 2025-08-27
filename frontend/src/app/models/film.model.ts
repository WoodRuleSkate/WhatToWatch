/**
 * Film interface defines the structure of film objects in the application
 * Інтерфейс Film визначає структуру об'єктів фільмів у додатку
 */
export interface Film {
  id: number;               // Unique film identifier / Унікальний ідентифікатор фільму
  title: string;            // Film title / Назва фільму
  release_year: number;     // Year when film was released / Рік випуску фільму
  genre: string;            // Film genre / Жанр фільму
  description: string;      // Film description / Опис фільму
  poster_url: string;       // URL to the film poster image / URL-адреса постера фільму
  added_by: number;         // ID of the user who added this film / ID користувача, який додав фільм
  created_at: string;       // Date and time when film was added / Дата і час додавання фільму
}
