import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usersService = inject(UsersService);

  subscription = new Subscription;

  showPassword: boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
      ],
    ],
  });

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    const sub = this.usersService.getUserByEmail(email as string).subscribe({
      next: (response: any) => {
        if (response.length) {
          if (response[0].password === password) {            
            sessionStorage.setItem('email', email as string);
            sessionStorage.setItem('admin', response[0].role.includes('admin') ? 'true' : 'false');
            this.router.navigate(['/home']);
          } else {
            alert('Password invalid')
          }
        } else {
          alert('Email invalid');
        }
      },
      error: (error) => {
        alert('Login invalid');
      }
    });
    this.subscription.add(sub);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}