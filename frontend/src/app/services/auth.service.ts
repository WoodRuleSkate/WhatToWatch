/**
 * Authentication service for user management
 * Сервіс автентифікації для управління користувачами
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API URL for authentication endpoints
  // URL API для ендпоінтів автентифікації
  private apiUrl = 'http://localhost:3001/api';

  // BehaviorSubject to track the current user state
  // BehaviorSubject для відстеження стану поточного користувача
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  // Observable to subscribe to user changes
  // Observable для підписки на зміни користувача
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Log in a user with email and password
   * Вхід користувача за допомогою електронної пошти та пароля
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(tap(response => {
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email
        };
        // Update the current user state
        // Оновлення стану поточного користувача
        this.currentUserSubject.next(user);
      }));
  }

  /**
   * Register a new user
   * Реєстрація нового користувача
   */
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, email, password });
  }

  /**
   * Log out the current user
   * Вихід поточного користувача
   */
  logout(): void {
    this.currentUserSubject.next(null);
  }

  /**
   * Check if a user is currently authenticated
   * Перевірка, чи користувач автентифікований
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get the current user information
   * Отримання інформації про поточного користувача
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
