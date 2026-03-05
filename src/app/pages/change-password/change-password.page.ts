import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/shared/confirmation-dialog/confirm-dialog.component';
import { UserModel } from '../../models/users.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);

  subscription = new Subscription;
  showPassword: boolean = false;

  loginForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
        ],
      ],
    },
    {
      validators: this.passwordsMatchValidator,
    }
  );

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  get confirmPassword() {
    return this.loginForm.controls['confirmPassword'];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const { email, password, confirmPassword } = this.loginForm.value;
    const subEmail = this.usersService.getUserByEmail(email as string).subscribe({
      next: (response: any) => {
        if (response.length) {
          const payload: UserModel = {
            ...response[0],
            name: response[0].name,
            surname: response[0].surname,
            username: response[0].username,
            password: password,
            email: response[0].email,
            role: response[0].role,
          };
          const subUpdate = this.usersService.updateUser(payload).subscribe({
            next: (response: any) => {
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '420px',
                data: {
                  title: 'Password updated',
                  message:
                    'Password updated successfully!',
                  confirmText: 'Confirm',
                  cancelText: 'Cancel',
                },
              });

              dialogRef.afterClosed().subscribe(confirmed => {
                if (!confirmed) return;

                sessionStorage.clear();
                this.router.navigate(['/login']);
              });
            },
            error: (error) => { }
          });
          this.subscription.add(subUpdate);
        } else {
          alert('Email invalid!');
        }
      },
      error: (error) => {
        alert('Unknown error!');
      }
    });
    this.subscription.add(subEmail);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordsMatchValidator(control: AbstractControl): null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({
        ...confirmPassword.errors,
        passwordsMismatch: true,
      });
    } else {
      if (confirmPassword.hasError('passwordsMismatch')) {
        const errors = { ...confirmPassword.errors };
        delete errors['passwordsMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  }
}