import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

// Questa è la funzione che intercetta le richieste HTTP
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Otteniamo il token da AuthService
  const token = authService.getToken();

  // Se il token esiste, aggiungiamo l'header di autorizzazione alla richiesta
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Se non c'è il token, proseguiamo la richiesta senza modifiche
  return next(req);
};
