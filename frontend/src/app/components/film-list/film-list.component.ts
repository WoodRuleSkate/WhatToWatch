//Film List Component - Displays the list of films with filtering options
//Компонент списку фільмів - Відображає список фільмів з можливостями фільтрації
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/film.model';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit {
  // List of films to display
  // Список фільмів для відображення
  films: Film[] = [];

  // Available genres for filtering
  // Доступні жанри для фільтрації
  genres: string[] = [];

  // Available years for filtering
  // Доступні роки для фільтрації
  years: number[] = [];

  // Selected filter values
  // Вибрані значення фільтрів
  selectedGenre = '';
  selectedYear = '';

  // State flags for UI
  // Прапори стану для інтерфейсу
  loading = true;
  error = '';

  constructor(
    private filmService: FilmService,
    private http: HttpClient
  ) { }

  //Initialize component and load necessary data
  //Ініціалізує компонент і завантажує необхідні дані
  ngOnInit(): void {
    this.loadGenres();
    this.loadYears();
    this.loadFilms();
  }

  //Load available genres from the API
  //Завантажує доступні жанри з API
  loadGenres(): void {
    this.http.get<string[]>('http://localhost:3001/api/genres').subscribe({
      next: (genres) => this.genres = genres,
      error: (err) => console.error('Error loading genres:', err)
    });
  }

  //Generate list of years for the filter (from current year back to 1950)
  //Генерує список років для фільтра (від поточного року до 1950)
loadYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
  }

  //Load films based on selected filters
  //Завантажує фільми на основі вибраних фільтрів
  loadFilms(): void {
    this.loading = true;
    const genre = this.selectedGenre || undefined;
    const year = this.selectedYear ? parseInt(this.selectedYear) : undefined;

    this.filmService.getFilms(genre, year).subscribe({
      next: (films) => {
        this.films = films;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading films';
        this.loading = false;
        console.error(err);
      }
    });
  }

  //Apply selected filters and reload films
  //Застосовує вибрані фільтри і перезавантажує фільм
  applyFilters(): void {
    this.loadFilms();
  }

  //Reset all filters and reload films
  //Скидає всі фільтри і перезавантажує фільми
  resetFilters(): void {
    this.selectedGenre = '';
    this.selectedYear = '';
    this.loadFilms();
  }
}
