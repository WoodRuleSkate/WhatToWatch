/**
 * Register Component - Handles new user registration
 *
 * Компонент реєстрації - Обробляє реєстрацію нових користувачів
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Form fields for new user registration
  // Поля форми для реєстрації нового користувача
  username = '';
  email = '';
  password = '';

  // State flags for UI feedback
  // Прапори стану для відгуку інтерфейсу
  error = '';
  success = false;

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Handle form submission for user registration
   *
   * Обробка відправки форми для реєстрації користувача
   */
  onSubmit(): void {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.success = true;
        // Redirect to login page after 2 seconds
        // Перенаправлення на сторінку входу через 2 секунди
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => this.error = err.error?.message || 'Registration error'
    });
  }
}
