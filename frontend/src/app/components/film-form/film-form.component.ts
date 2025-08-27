/**
 * Film Form Component - Handles adding new films and editing existing films
 *
 * Компонент форми фільму - Обробляє додавання нових фільмів та редагування існуючих фільмів
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FilmService } from '../../services/film.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-film-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './film-form.component.html',
  styleUrls: ['./film-form.component.css']
})
export class FilmFormComponent implements OnInit {
  // Film object to hold form data
  // Об'єкт фільму для зберігання даних форми
  film = {
    id: 0,
    title: '',
    release_year: new Date().getFullYear(),
    genre: '',
    description: '',
    poster_url: ''
  };

  // Available genres for selection
  // Доступні жанри для вибору
  genres: string[] = [];

  // State flags for component behavior
  // Прапори стану для поведінки компонента
  isEditing = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private filmService: FilmService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  /**
   * Initialize component and determine if editing or creating
   *
   * Ініціалізує компонент і визначає, чи це редагування або створення
   */
  ngOnInit(): void {
    // Load available genres for dropdown
    // Завантаження доступних жанрів для випадаючого списку
    this.loadGenres();

    // Check if this is editing mode by checking for film ID in URL
    // Перевірка чи це режим редагування через перевірку ID фільму в URL
    this.route.params.subscribe(params => {
      const filmId = params['id'];
      if (filmId) {
        this.isEditing = true;
        this.loadFilm(parseInt(filmId));
      }
    });
  }

  /**
   * Load available genres from the API
   *
   * Завантажує доступні жанри з API
   */
  loadGenres(): void {
    this.http.get<string[]>('http://localhost:3001/api/genres').subscribe({
      next: (genres) => this.genres = genres,
      error: (err) => console.error('Error loading genres:', err)
    });
  }

  /**
   * Load film data for editing
   *
   * Завантажує дані фільму для редагування
   */
  loadFilm(id: number): void {
    this.loading = true;
    this.filmService.getFilmById(id).subscribe({
      next: (film) => {
        this.film = film;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Film not found';
        this.loading = false;
      }
    });
  }

  /**
   * Handle form submission for both create and update operations
   *
   * Обробка відправки форми для операцій створення та оновлення
   */
  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    // Prepare film data for submission
    // Підготовка даних фільму для відправки
    const filmData = {
      title: this.film.title,
      release_year: this.film.release_year,
      genre: this.film.genre,
      description: this.film.description,
      poster_url: this.film.poster_url
    };

    if (this.isEditing) {
      // Update existing film
      // Оновлення існуючого фільму
      this.filmService.updateFilm(this.film.id, filmData).subscribe({
        next: (film) => {
          this.success = 'Film updated successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/film', film.id]), 1500);
        },
        error: (err) => {
          console.error('Update error:', err);
          this.error = 'Error updating film';
          this.loading = false;
        }
      });
    } else {
      // Create new film
      // Створення нового фільму
      this.filmService.createFilm(filmData).subscribe({
        next: (film) => {
          this.success = 'Film added successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/film', film.id]), 1500);
        },
        error: (err) => {
          console.error('Creation error:', err);
          this.error = 'Error adding film';
          this.loading = false;
        }
      });
    }
  }
}
