import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../services/translation.service';
import { UserModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private router = inject(Router);
  private usersService = inject(UsersService);

  form!: FormGroup;
  subscription = new Subscription();

  user?: UserModel;

  showPassword = false;

  constructor(private fb: FormBuilder, public translationService: TranslationService, private location: Location) { }

  ngOnInit() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => { });

    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
        ],
      ],
      role: [[], Validators.required],
    });

    this.loadUser();

    if (!this.user?.role.includes('admin')) {
      // Role is not editable when not admin
      this.form.get('role')?.clearValidators();
      this.form.get('role')?.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadUser() {
    const loggedUser = sessionStorage.getItem('email');
    if (loggedUser) {
      const sub = this.usersService.getUserByEmail(loggedUser).subscribe({
        next: (response) => {
          this.user = response[0];

          this.form.patchValue({
            name: response[0].name,
            surname: response[0].surname,
            username: response[0].username,
            email: response[0].email,
            password: response[0].password,
            role: response[0].role,
          });
        },
        error: () => {
        },
      });
      this.subscription.add(sub);
    }
  }

  cancel() {
    this.location.back();
  }

  updateProfile() {
    if (this.form.invalid || !this.user) return;

    const formValue = this.form.getRawValue();

    const payload: UserModel = {
      ...this.user,
      name: formValue.name,
      surname: formValue.surname,
      username: formValue.username,
      email: formValue.email,
      role: formValue.role,
    };

    const sub = this.usersService.updateUser(payload).subscribe({
      next: () => this.location.back(),
      error: err => console.error('Update failed', err),
    });

    this.subscription.add(sub);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get password() {
    return this.form.controls['password'];
  }
}