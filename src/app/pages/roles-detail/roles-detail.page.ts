import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { RolesService } from '../../services/roles.service';
import { RoleModel } from '../../models/roles.model';

import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-roles-detail',
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
  templateUrl: './roles-detail.page.html',
  styleUrls: ['./roles-detail.page.scss'],
})
export class RolesDetailPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rolesService = inject(RolesService);

  form!: FormGroup;
  subscription = new Subscription();

  role?: RoleModel;
  isEdit = false;

  // 🔒 Character limit
  readonly maxDescriptionLength = 100;

  constructor(private fb: FormBuilder, public translationService: TranslationService) { }

  ngOnInit() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    // detect future language changes
    this.translationService.currentLanguage$.subscribe(lang => {
      // reload translations if needed
    });
    
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.maxLength(this.maxDescriptionLength)],
      ],
      permissions: ['', Validators.required],
    });

    const roleId = this.route.snapshot.paramMap.get('id');
    if (roleId) {
      this.isEdit = true;
      this.loadRole(roleId);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadRole(id: string) {
    const sub = this.rolesService.getRoleById(id).subscribe(role => {
      this.role = role;

      this.form.patchValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    });

    this.subscription.add(sub);
  }

  cancel() {
    this.router.navigate(['/roles']);
  }

  updateRole() {
    if (this.form.invalid || !this.role) return;

    const formValue = this.form.getRawValue();

    const payload: RoleModel = {
      ...this.role,
      name: formValue.name,
      description: formValue.description,
      permissions: formValue.permissions,
    };

    const sub = this.rolesService.updateRole(payload).subscribe({
      next: () => this.router.navigate(['/roles']),
      error: err => console.error('Update failed', err),
    });

    this.subscription.add(sub);
  }

  createRole() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const payload: RoleModel = {
      id: crypto.randomUUID(),
      name: formValue.name,
      description: formValue.description,
      permissions: formValue.permissions,
    };

    const sub = this.rolesService.createRole(payload).subscribe({
      next: () => this.router.navigate(['/roles']),
      error: err => console.error('Create failed', err),
    });

    this.subscription.add(sub);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}