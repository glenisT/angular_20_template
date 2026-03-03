import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, //Improves performance, Angular will only re-render the component when directly modified by user
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss'
})
export class DatepickerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() timeLabel?: string;
  @Input() placeholder?: string;
  @Input() showTime: boolean = false;

  dateControl = new FormControl();
  timeControl = new FormControl();

  ngOnInit() {
    this.setupControls();
    this.setupValidation();
    this.subscribeToChanges();
    this.subscribeToParentChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupControls() {
    // Initialize controls based on parent control value
    const parentValue = this.control.value;

    if (parentValue) {
      let date: Date;

      if (typeof parentValue === 'string' && !this.showTime) {
        // Se è una stringa di data (YYYY-MM-DD) e showTime = false, 
        // creiamo la data in locale evitando problemi di fuso orario
        const [year, month, day] = parentValue.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        // Per date con ora o oggetti Date
        date = new Date(parentValue);
      }

      this.dateControl.setValue(date);

      if (this.showTime) {
        this.timeControl.setValue(date);
      }
    }
  }

  private setupValidation() {
    // Controlla se il FormControl padre ha già Validators.required
    const parentHasRequiredValidator = this.control.hasValidator(Validators.required);

    if (parentHasRequiredValidator) {
      this.dateControl.setValidators([Validators.required]);
      if (this.showTime) {
        this.timeControl.setValidators([Validators.required]);
      }
    }
  }

  private subscribeToChanges() {
    // Subscribe to date changes
    this.dateControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateParentControl();
      });

    // Subscribe to time changes if showTime is enabled
    if (this.showTime) {
      this.timeControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateParentControl();
        });
    }
  }

  private subscribeToParentChanges() {
    // Ascolta i cambiamenti del control dall'esterno (es. patchValue)
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // Solo se il valore è diverso da quello attuale del dateControl per evitare loop infiniti
        const currentDateValue = this.dateControl.value;
        const isSameValue = (value && currentDateValue &&
          new Date(value).getTime() === new Date(currentDateValue).getTime()) ||
          (!value && !currentDateValue);

        if (!isSameValue) {
          if (value) {
            let date: Date;

            if (typeof value === 'string' && !this.showTime) {
              // Se è una stringa di data (YYYY-MM-DD) e showTime = false
              const [year, month, day] = value.split('-').map(Number);
              date = new Date(year, month - 1, day);
            } else {
              // Per date con ora o oggetti Date
              date = new Date(value);
            }

            this.dateControl.setValue(date, { emitEvent: false });

            if (this.showTime) {
              this.timeControl.setValue(date, { emitEvent: false });
            }
          } else {
            this.dateControl.setValue(null, { emitEvent: false });
            if (this.showTime) {
              this.timeControl.setValue(null, { emitEvent: false });
            }
          }
        }
      });
  }

  private updateParentControl() {
    const dateValue = this.dateControl.value;

    if (!dateValue) {
      this.control.setValue(null);
      this.updateParentValidation();
      return;
    }

    if (this.showTime) {
      // Per date con ora, usa un oggetto Date completo
      let finalDate = new Date(dateValue);

      if (this.timeControl.value) {
        const timeValue = this.timeControl.value;
        if (timeValue instanceof Date) {
          finalDate.setHours(timeValue.getHours());
          finalDate.setMinutes(timeValue.getMinutes());
          finalDate.setSeconds(0);
          finalDate.setMilliseconds(0);
        }
      }

      this.control.setValue(finalDate);
    } else {
      // Per date senza ora, usa una stringa nel formato locale YYYY-MM-DD
      // Questo evita problemi di fuso orario
      const date = new Date(dateValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      this.control.setValue(dateString);
    }

    this.updateParentValidation();
  }

  private updateParentValidation() {
    const hasDateError = this.dateControl.invalid && this.dateControl.touched;
    const hasTimeError = this.showTime && this.timeControl.invalid && this.timeControl.touched;

    if (hasDateError || hasTimeError) {
      this.control.setErrors({ invalid: true });
    } else {
      this.control.setErrors(null);
    }
  }
}
