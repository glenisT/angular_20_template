import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public isLoading$ = this.loadingSubject.asObservable(); // Alias per compatibilità

  private activeRequests = 0;

  /**
   * Show loading spinner
   */
  show() {
    this.activeRequests++;
    this.loadingSubject.next(true);
  }

  /**
   * Hide loading spinner
   */
  hide() {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Reset loading spinner
   */
  reset() {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
  }
} 