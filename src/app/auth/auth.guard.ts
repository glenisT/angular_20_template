import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const isLoggedIn = !!sessionStorage.getItem('email');
  const isAdmin = sessionStorage.getItem('admin') === 'true';

  if (!isLoggedIn) {
    return router.navigate(['/login']);
  }

  // Only check admin if the route requires it
  if (route.data?.['adminOnly'] && !isAdmin) {
    return router.navigate(['/unauthorized']);
  }

  return true;
};
