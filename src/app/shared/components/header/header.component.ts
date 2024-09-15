import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class HeaderComponent {
  constructor(private router: Router  ) {}
  public goToLogin(){
    this.router.navigateByUrl('/login');
  }
  public goToHome(){
    this.router.navigateByUrl('/home');
  }
  public goToCatalog(){
    this.router.navigateByUrl('/catalog');
  }
}
