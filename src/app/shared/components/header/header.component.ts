import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public currentRoute: string = '';

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
  public goToLogin() {
    this.router.navigateByUrl('/login');
  }
  public goToHome() {
    this.router.navigateByUrl('/home');
  }
  public goToCatalog() {
    this.router.navigateByUrl('/catalog');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
