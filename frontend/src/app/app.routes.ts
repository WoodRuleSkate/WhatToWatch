/**
 * Application routes configuration
 * Конфігурація маршрутів додатку
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',loadComponent: () => import('./components/film-list/film-list.component').then(c => c.FilmListComponent)},
  { path: 'film/:id', loadComponent: () => import('./components/film-detail/film-detail.component').then(c => c.FilmDetailComponent)},
  { path: 'add-film', loadComponent: () => import('./components/film-form/film-form.component').then(c => c.FilmFormComponent)},
  { path: 'edit-film/:id', loadComponent: () => import('./components/film-form/film-form.component').then(c => c.FilmFormComponent)},
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)},
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)},
  { path: '**', redirectTo: '' }
];
