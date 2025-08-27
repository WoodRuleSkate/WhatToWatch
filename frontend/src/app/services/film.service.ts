/**
 * Film service for managing films and comments
 * Сервіс фільмів для управління фільмами та коментарями
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../models/film.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  // Base API URL
  // Базовий URL API
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  /**
   * Get a list of films with optional filtering by genre and year
   * Отримання списку фільмів з необов'язковою фільтрацією за жанром та роком
   */
  getFilms(genre?: string, year?: number): Observable<Film[]> {
    let params = new HttpParams();
    if (genre) params = params.set('genre', genre);
    if (year) params = params.set('year', year.toString());
    return this.http.get<Film[]>(`${this.apiUrl}/films`, { params });
  }

  /**
   * Get a single film by its ID
   * Отримання одного фільму за ID
   */
  getFilmById(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.apiUrl}/films/${id}`);
  }

  /**
   * Get comments for a specific film
   * Отримання коментарів для конкретного фільму
   */
  getComments(filmId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/films/${filmId}/comments`);
  }

  /**
   * Add a new comment to a film
   * Додавання нового коментаря до фільму
   */
  addComment(filmId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/films/${filmId}/comments`, {
      content
    });
  }

  /**
   * Create a new film
   * Створення нового фільму
   */
  createFilm(filmData: Partial<Film>): Observable<Film> {
    return this.http.post<Film>(`${this.apiUrl}/films`, filmData);
  }

  /**
   * Update an existing film
   * Оновлення існуючого фільму
   */
  updateFilm(id: number, filmData: Partial<Film>): Observable<Film> {
    return this.http.put<Film>(`${this.apiUrl}/films/${id}`, filmData);
  }
}
