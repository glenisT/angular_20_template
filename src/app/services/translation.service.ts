import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any = {};
  private currentLangSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLangSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadTranslations(lang: string) {
    this.currentLangSubject.next(lang);
    localStorage.setItem('selectedLanguage', lang);

    return this.http.get(`/i18n/${lang}.json`).subscribe(data => {
      this.translations = data;
    });
  }

  translate(key: string): string {
    return key.split('.').reduce((obj: any, part) => {
      return obj && obj[part] !== undefined ? obj[part] : key;
    }, this.translations);
  }

  get currentLanguage() {
    return this.currentLangSubject.value;
  }
}