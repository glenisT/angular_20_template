import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../components/shared/confirmation-dialog/confirm-dialog.component';
import { RoleModel } from '../../models/roles.model';
import { RolesService } from '../../services/roles.service';
import { TranslationService } from '../../services/translation.service';
import { UserModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription = new Subscription();

  displayedColumns: string[] = [
    'name',
    'description',
    'permissions',
    'actions',
  ];

  dataSource: RoleModel[] = [];
  totalRoles = 0;
  pageIndex = 0;
  pageSize = 10;

  user: UserModel | null = null;

  constructor(public translationService: TranslationService) { }

  ngOnInit() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => { });
    this.loadRoles();

    const loggedUser = sessionStorage.getItem('email');

    if (loggedUser) {
      const sub = this.usersService.getUserByEmail(loggedUser).subscribe({
        next: (response) => {
          this.user = response[0];
        },
        error: () => {
        },
      });

      this.subscription.add(sub);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ===============================
  // Data loading (SERVER-SIDE)
  // ===============================
  loadRoles() {
    const sub = this.rolesService
      .getRolesPaged(
        this.pageIndex,
        this.pageSize,
        this.sort?.active,
        this.sort?.direction as 'asc' | 'desc'
      )
      .subscribe({
        next: response => {
          this.dataSource = response.body ?? [];
          this.totalRoles = Number(response.headers.get('X-Total-Count'));
        },
        error: err => console.error('Load roles failed', err),
      });

    this.subscription.add(sub);
  }

  // ===============================
  // Pagination
  // ===============================
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRoles();
  }

  // ===============================
  // Sorting
  // ===============================
  onSortChange(sort: Sort) {
    this.pageIndex = 0;
    this.loadRoles();
  }

  // ===============================
  // Navigation
  // ===============================
  navigateToUpsert(roleId?: string) {
    if (roleId) {
      this.router.navigate(['/roles/edit', roleId]);
    } else {
      this.router.navigate(['/roles/create']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ===============================
  // Delete
  // ===============================
  deleteRole(roleId: string) {
    if (!roleId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete role',
        message:
          'Are you sure you want to delete this role? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      const sub = this.rolesService.deleteRole(roleId).subscribe({
        next: () => this.loadRoles(),
        error: err => console.error('Delete failed', err),
      });

      this.subscription.add(sub);
    });
  }
}