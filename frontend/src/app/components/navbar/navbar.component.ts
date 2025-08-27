//Navbar component for application navigation
//Компонент навігаційної панелі для переміщення додатком
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // Current authenticated user (null if not logged in)
  // Поточний автентифікований користувач (null якщо не увійшов)
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  //Initialize component and subscribe to user authentication changes
  //Ініціалізація компонента та підписка на зміни автентифікації користувача
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  //Handle user logout and redirect to home page
  //Обробка виходу користувача та перенаправлення на головну сторінку
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
