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
import { UsersService } from '../../services/users.service';
import { UserModel } from '../../models/users.model';
import { AuthUser } from '../../models/auth-user.model';

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
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription = new Subscription();

  displayedColumns: string[] = [
    'name',
    'surname',
    'username',
    'email',
    'role',
    'actions',
  ];

  dataSource: UserModel[] = [];
  totalUsers = 0;
  pageIndex = 0;
  pageSize = 10;

  user: UserModel | null = null;

  constructor(public translationService: TranslationService) { }

  ngOnInit() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translationService.loadTranslations(selectedLang);

    this.translationService.currentLanguage$.subscribe(lang => { });
    this.loadUsers();

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
  loadUsers() {
    const sub = this.usersService
      .getUsersPaged(
        this.pageIndex,
        this.pageSize,
        this.sort?.active,
        this.sort?.direction as 'asc' | 'desc'
      )
      .subscribe({
        next: response => {
          this.dataSource = response.body ?? [];
          this.totalUsers = Number(response.headers.get('X-Total-Count'));
        },
        error: err => console.error('Load users failed', err),
      });

    this.subscription.add(sub);
  }

  // ===============================
  // Pagination
  // ===============================
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  // ===============================
  // Sorting
  // ===============================
  onSortChange(sort: Sort) {
    this.pageIndex = 0; // reset page on sort
    this.loadUsers();
  }

  // ===============================
  // Navigation
  // ===============================
  navigateToUpsert(userId?: string) {
    if (userId) {
      this.router.navigate(['/users/edit', userId]);
    } else {
      this.router.navigate(['/users/create']);
    }
  }

  // ===============================
  // Delete
  // ===============================
  deleteUser(userId: string) {
    if (!userId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete user',
        message:
          'Are you sure you want to delete this user? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      const sub = this.usersService.deleteUser(userId).subscribe({
        next: () => {
          if (userId === this.user?.id) {
            this.logout();
            return;
          }

          this.loadUsers();
        },
        error: (err) => {
          console.error('Delete failed', err);
        },
      });

      this.subscription.add(sub);
    });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isCurrentUser(user: any): boolean {
    return user.email === sessionStorage.getItem('email');
  }
}