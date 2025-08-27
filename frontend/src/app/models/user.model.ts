/**
 * User interface defines the structure of user objects
 * Інтерфейс User визначає структуру об'єктів користувачів
 */
export interface User {
  id: number;       // User ID / ID користувача
  username: string; // Username / Ім'я користувача
  email: string;    // Email address / Електронна адреса
}

/**
 * AuthResponse interface defines the structure of authentication response from the server
 * Інтерфейс AuthResponse визначає структуру відповіді автентифікації від сервера
 */
export interface AuthResponse {
  id: number;       // User ID / ID користувача
  username: string; // Username / Ім'я користувача
  email: string;    // Email address / Електронна адреса
  token: string;    // Authentication token / Токен автентифікації
}
