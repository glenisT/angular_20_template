import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [
    MatTimepickerModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, //Improves performance, Angular will only re-render the component when directly modified by user
  providers: [provideNativeDateAdapter()],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
})
export class TimepickerComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() min!: any;
  @Input() max!: any;
}
