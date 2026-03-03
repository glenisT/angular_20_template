import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-input',
  imports: [
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, //Improves performance, Angular will only re-render the component when directly modified by user
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() control!: FormControl;
  @Input() id!: string;
  @Input() placeholder: string = '';
  @Input() label!: string;
  @Input() icon: string = '';
  @Input() type:
    | 'number'
    | 'decimal'
    | 'string'
    | 'text'
    | 'email'
    | 'password' = 'text';
  @Input() pattern: string = '';
  @Input() isDisabled: boolean = false;
  @Input() readonly!: boolean;

  // Control interno per gestire la visualizzazione del decimal
  displayControl = new FormControl('');

  ngOnInit() {
    if (this.type === 'decimal') {
      this.setupDecimalHandling();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDecimalHandling() {
    // Inizializza il display control con il valore formattato
    const initialValue = this.control.value;
    if (initialValue !== null && initialValue !== undefined) {
      this.displayControl.setValue(this.formatNumberForDisplay(initialValue));
    }

    // Ascolta i cambiamenti del display control (input dell'utente)
    this.displayControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((displayValue: string | null) => {
        const numericValue = this.parseDisplayValue(displayValue || '');
        this.control.setValue(numericValue, { emitEvent: false });
      });

    // Ascolta i cambiamenti del control principale (patchValue, etc.)
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const formattedValue = this.formatNumberForDisplay(value);
        if (this.displayControl.value !== formattedValue) {
          this.displayControl.setValue(formattedValue, { emitEvent: false });
        }
      });
  }

  private formatNumberForDisplay(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Converte il numero in stringa usando la virgola come separatore decimale
    return value.toString().replace('.', ',');
  }

  private parseDisplayValue(displayValue: string): number | null {
    if (!displayValue || displayValue.trim() === '') {
      return null;
    }

    // Validazione: solo numeri, virgole e punti
    const validDecimalRegex = /^-?\d*[,.]?\d*$/;
    if (!validDecimalRegex.test(displayValue)) {
      return null;
    }

    // Converte la virgola in punto e parsa il numero
    const normalizedValue = displayValue.replace(',', '.');
    const parsed = parseFloat(normalizedValue);

    return isNaN(parsed) ? null : parsed;
  }

  // Getter per determinare quale control usare nel template
  get activeControl(): FormControl {
    return this.type === 'decimal' ? this.displayControl : this.control;
  }

  // Getter per determinare il tipo di input HTML
  get inputType(): string {
    return this.type === 'decimal' ? 'text' : this.type;
  }

  // Gestisce l'input da tastiera per il tipo decimal
  onKeyDown(event: KeyboardEvent): void {
    if (this.type !== 'decimal') {
      return; // Non applicare validazione per altri tipi
    }

    const key = event.key;
    const currentValue = (event.target as HTMLInputElement).value;

    // Permetti sempre i tasti di controllo
    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];
    if (controlKeys.includes(key) || event.ctrlKey || event.metaKey) {
      return;
    }

    // Permetti solo numeri, virgola e punto (e il segno meno all'inizio)
    const allowedKeys = /^[0-9,.-]$/;
    if (!allowedKeys.test(key)) {
      event.preventDefault();
      return;
    }

    // Previeni più di una virgola/punto
    if (
      (key === ',' || key === '.') &&
      (currentValue.includes(',') || currentValue.includes('.'))
    ) {
      event.preventDefault();
      return;
    }

    // Previeni il segno meno se non è all'inizio
    if (key === '-' && currentValue.length > 0) {
      event.preventDefault();
      return;
    }
  }
}
