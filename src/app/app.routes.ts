import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'changePassword',
    loadComponent: () =>
      import('./pages/change-password/change-password.page').then(m => m.ChangePasswordPage),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'users',
        canActivate: [authGuard],
        data: { adminOnly: true },
        loadComponent: () =>
          import('./pages/users/users.page').then(m => m.UsersPage),
      },
      {
        path: 'users/create',
        canActivate: [authGuard],
        data: { adminOnly: true },
        loadComponent: () =>
          import('./pages/users-detail/users-detail.page')
            .then(m => m.UsersDetailPage),
      },
      {
        path: 'users/edit/:id',
        canActivate: [authGuard],
        data: { adminOnly: true },
        loadComponent: () =>
          import('./pages/users-detail/users-detail.page')
            .then(m => m.UsersDetailPage),
      },
      {
        path: 'roles',
        canActivate: [authGuard],
        data: { adminOnly: true },
        loadComponent: () =>
          import('./pages/roles/roles.page').then(m => m.RolesPage),
      },
      {
        path: 'roles/create',
        canActivate: [authGuard],
        data: { adminOnly: true },
        loadComponent: () =>
          import('./pages/roles-detail/roles-detail.page')
            .then(m => m.RolesDetailPage),
      },
      {
        path: 'roles/edit/:id',
        canActivate: [authGuard],
        data: { adminOnly: true },
        loadComponent: () =>
          import('./pages/roles-detail/roles-detail.page')
            .then(m => m.RolesDetailPage),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: 'unauthorized',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/unauthorized/unauthorized').then(m => m.Unauthorized),
      },
    ]
  }
];