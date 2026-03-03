import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-multiple-select',
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, //Improves performance, Angular will only re-render the component when directly modified by user
  templateUrl: './multiple-select.component.html',
  styleUrl: './multiple-select.component.scss',
})
export class MultipleSelectComponent {
  @Input() options: any[] = [];
  @Input() multiple: boolean = true;
  @Input() control: FormControl = new FormControl('', Validators.required);
  @Input() placeholder: string = '';
  @Output() selectedOptionsChange = new EventEmitter<any>();

  selectedValues: string[] = [];

  onSelectionChange(): void {
    this.selectedOptionsChange.emit(this.control);
  }
}
