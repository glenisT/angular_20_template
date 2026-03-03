import { ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth/auth.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { routes } from './app.routes';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app/config/translate-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';

class CustomPaginatorIntl extends MatPaginatorIntl {
  protected readonly translateService = inject(TranslateService);

  constructor() {
    super();
    this.translateService.onLangChange.subscribe(() => {
      this.updateLabels();
    });
    this.translateService.onFallbackLangChange.subscribe(() => {
      this.updateLabels();
    });
    // Aggiorna le label inizialmente
    setTimeout(() => this.updateLabels(), 0);
  }

  private updateLabels(): void {
    this.itemsPerPageLabel = this.translateService.instant('PAGINATOR.PAGE_SIZE_LABEL');
    this.changes.next();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor]), withFetch()),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'it',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
};
