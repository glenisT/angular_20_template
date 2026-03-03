import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Non mostrare lo spinner per le chiamate di tipo GET
//  if (req.method !== 'GET') {
    loadingService.show();
//  }

  return next(req).pipe(
    finalize(() => {
      //if (req.method !== 'GET') {
        loadingService.hide();
      //}
    })
  );
}; 