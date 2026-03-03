import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users.service';
import { UserModel } from '../../models/users.model';

import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-users-detail',
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
    MatIconModule
  ],
  templateUrl: './users-detail.page.html',
  styleUrls: ['./users-detail.page.scss'],
})
export class UsersDetailPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);

  form!: FormGroup;
  subscription = new Subscription();

  user?: UserModel;
  isEdit = false;

  showPassword = false;
  passwordEnabledForLoggeUser = false;

  constructor(private fb: FormBuilder, public translationService: TranslationService) { }

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

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEdit = true;
      this.loadUser(userId);

      // Password is optional when editing
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadUser(id: string) {
    const sub = this.usersService.geUserById(id).subscribe(user => {
      this.user = user;
      this.passwordEnabledForLoggeUser = this.isCurrentUser(user);

      this.form.patchValue({
        name: user.name,
        surname: user.surname,
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
      });
    });

    this.subscription.add(sub);
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  updateUser() {
    if (this.form.invalid || !this.user) return;

    const formValue = this.form.getRawValue();

    const payload: UserModel = {
      ...this.user,
      name: formValue.name,
      surname: formValue.surname,
      username: formValue.username,
      password: formValue.password,
      email: formValue.email,
      role: formValue.role,
    };

    const sub = this.usersService.updateUser(payload).subscribe({
      next: () => this.router.navigate(['/users']),
      error: err => console.error('Update failed', err),
    });

    this.subscription.add(sub);
  }

  createUser() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const payload: UserModel = {
      id: crypto.randomUUID(),
      name: formValue.name,
      surname: formValue.surname,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
    };

    const sub = this.usersService.createUser(payload).subscribe({
      next: () => this.router.navigate(['/users']),
      error: err => console.error('Create failed', err),
    });

    this.subscription.add(sub);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get password() {
    return this.form.controls['password'];
  }

  isCurrentUser(user: any): boolean {
    return user.email === sessionStorage.getItem('email');
  }
}