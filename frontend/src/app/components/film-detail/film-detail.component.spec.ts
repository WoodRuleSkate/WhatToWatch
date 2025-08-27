//Film Detail Component - Displays detailed information about a specific film and its comments
//Компонент деталей фільму - Відображає детальну інформацію про конкретний фільм та його коментарі
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FilmService } from '../../services/film.service';
import { AuthService } from '../../services/auth.service';
import { Film } from '../../models/film.model';
import { Comment } from '../../models/comment.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css'],
})
export class FilmDetailComponent implements OnInit {
  // Current film data
  // Дані поточного фільму
  film: Film | null = null;

  // Comments for the current film
  // Коментарі до поточного фільму
  comments: Comment[] = [];

  // Currently authenticated user
  // Поточний автентифікований користувач
  currentUser: User | null = null;

  // New comment being written
  // Новий коментар, який пишеться
  newComment = '';

  // State flags for UI
  // Прапори стану для інтерфейсу
  loading = true;
  error = '';
  commentLoading = false;
  commentError = '';

  constructor(
    private route: ActivatedRoute,
    private filmService: FilmService,
    private authService: AuthService
  ) {}

  //Initialize component and load necessary data
  //Ініціалізує компонент і завантажує необхідні дані
  ngOnInit(): void {
    // Subscribe to user authentication changes
    // Підписка на зміни автентифікації користувача
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Get film ID from URL and load data
    // Отримання ID фільму з URL і завантаження даних
    this.route.params.subscribe((params) => {
      const filmId = parseInt(params['id']);
      this.loadFilm(filmId);
      this.loadComments(filmId);
    });
  }

  //Load film details by ID
  //Завантажити деталі фільму за ID
  loadFilm(id: number): void {
    this.filmService.getFilmById(id).subscribe({
      next: (film) => {
        this.film = film;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Film not found';
        this.loading = false;
      },
    });
  }

  //Load comments for the current film
  //Завантажити коментарі для поточного фільм
  loadComments(filmId: number): void {
    this.filmService.getComments(filmId).subscribe({
      next: (comments) => (this.comments = comments),
      error: (err) => console.error('Error loading comments:', err),
    });
  }

  //Add a new comment to the current film
  //Додати новий коментар до поточного фільму
  addComment(): void {
    if (!this.newComment.trim() || !this.currentUser || !this.film) return;

    this.commentLoading = true;
    this.commentError = '';

    this.filmService.addComment(this.film.id, this.newComment).subscribe({
      next: (comment) => {
        // Add comment to the list
        // Додавання коментаря до списку
        this.comments = [comment, ...this.comments];
        this.newComment = '';
        this.commentLoading = false;
      },
      
      error: (err) => {
        console.error('Error adding comment:', err);
        this.commentError = 'Error adding comment';
        this.commentLoading = false;
      },
    });
  }
}
