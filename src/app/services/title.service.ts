import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titleSubject = new BehaviorSubject<string>('Ubiquity FE');
  private titleKeySubject = new BehaviorSubject<string | null>(null);
  
  public title$: Observable<string> = this.titleSubject.asObservable();
  public titleKey$: Observable<string | null> = this.titleKeySubject.asObservable();

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  setTitleKey(titleKey: string): void {
    this.titleKeySubject.next(titleKey);
  }

  getTitle(): string {
    return this.titleSubject.value;
  }

  getTitleKey(): string | null {
    return this.titleKeySubject.value;
  }
} 