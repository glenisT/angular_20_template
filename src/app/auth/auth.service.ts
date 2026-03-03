import { inject, Injectable } from '@angular/core';
import { AuthUser } from '../models/auth-user.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private readonly TOKEN_KEY = 'ubiquity-token';

  // Cache per il token decodificato
  private cachedUser: AuthUser | null = null;
  private cachedToken: string | null = null;

  private cachedUserSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.cachedUserSubject.asObservable();

  login(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.clearCache();
    this.router.navigate(['/home']);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.clearCache();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  /**
   * Pulisce la cache interna
   */
  private clearCache(): void {
    this.cachedUser = null;
    this.cachedToken = null;
    this.cachedUserSubject.next(null);
  }
  /**
   * Ottiene l'utente con caching per evitare decodifiche ripetute
   */
  getUser(): AuthUser | null {
    const token = this.getToken();

    if (!token) {
      this.clearCache();
      return null;
    }
    // Se il token è cambiato, pulisce la cache

    if (this.cachedToken !== token) {
      this.clearCache();
    }
    // Se il token è scaduto, pulisce la cache

    if (this.isTokenExpired(token)) {
      this.clearCache();
      return null;
    }
    // Se abbiamo già l'utente in cache, lo restituisce

    if (this.cachedUser) {
      this.cachedUserSubject.next(this.cachedUser);
      return this.cachedUser;
    }
    // Decodifica il token solo se necessario

    try {
      const decoded: any = jwtDecode(token);

      this.cachedUser = {
        sub: decoded.sub,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        authorities: decoded.authorities || [],
      };
      this.cachedToken = token;
      this.cachedUserSubject.next(this.cachedUser);
      return this.cachedUser;
    } catch (e) {
      this.clearCache();
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  }

  updateCachedUser(updates: Partial<AuthUser>): void {
    if (!this.cachedUser) {
      this.getUser();
    }
    if (this.cachedUser) {
      this.cachedUser = {
        ...this.cachedUser,
        ...updates,
      };
      this.cachedUserSubject.next(this.cachedUser);
    }
  }
  /**
   * Controlla se l'utente ha una specifica authority
   */
  hasAuthority(authority: string): boolean {
    const user = this.getUser();
    return !!user?.authorities?.includes(authority);
  }

  hasAnyAuthority(authorities: string[]): boolean {
    return authorities.some((auth) => this.hasAuthority(auth));
  }

  getUserAuthorities(): string[] {
    const user = this.getUser();
    return user?.authorities || [];
  }
  /**
   * Forza il refresh della cache (utile per testing o aggiornamenti)
   */
  refreshUserCache(): void {
    this.clearCache();
    this.getUser();
  }
}
