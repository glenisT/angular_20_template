// src/app/shared/base/base.component.ts
import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TitleService } from '../../services/title.service';

@Directive()
export abstract class SubscriptionComponent implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly translate = inject(TranslateService);
  protected readonly titleService = inject(TitleService);

  ngOnInit() {
    this.onInit();
  }

  protected abstract onInit(): void;

  /**
   * Wrapper per subscription con gestione automatica unsubscribe
   */
  protected subscribe<T>(
    observable: Observable<T>, 
    next: (value: T) => void, 
    error?: (error: any) => void
  ): void {
    const subscription = observable.pipe(takeUntilDestroyed(this.destroyRef));
    
    if (error) {
      subscription.subscribe({ next, error });
    } else {
      subscription.subscribe(next);
    }
  }

  /**
   * Imposta il titolo con traduzione automatica quando cambia la lingua
   */
  protected setPageTitle(titleKey: string): void {
    this.titleService.setTitleKey(titleKey);
  }

}