/**
 * Login Component - Handles user authentication
 *
 * Компонент входу - Обробляє автентифікацію користувача
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Form fields for user credentials
  // Поля форми для облікових даних користувача
  email = '';
  password = '';

  // Error message for failed login attempts
  // Повідомлення про помилку для невдалих спроб входу
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Handle form submission for user login
   *
   * Обробка відправки форми для входу користувача
   */
  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Incorrect email or password'
    });
  }
}
