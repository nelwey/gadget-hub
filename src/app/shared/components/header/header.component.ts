import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public currentRoute: string = '';
  constructor(private router: Router) {
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
    this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  }

  logout(): void {
    sessionStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
