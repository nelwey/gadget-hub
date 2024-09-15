import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  constructor(private router: Router) { }

  public users: { email: string; password: string }[] = [
    { email: 'nelwey@mail.ru', password: '123' }
  ];
  public email: string = "";
  public password: string = "";


  login() {
    const user = this.users.find(u => u.email === this.email && u.password === this.password);
    if (user) {
      sessionStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/catalog']);
    } else {
      alert('Invalid credentials');
    }
  }

}
