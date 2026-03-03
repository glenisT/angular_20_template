import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class UploadFileComponent {
  fileUploadForm: any | {};
  selectedFileName: string = '';

  @Output() fileSelected = new EventEmitter<File>();
  @Input() control: FormControl = new FormControl('', Validators.required);
  @Input() label: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.fileUploadForm = this.formBuilder.group({
      file: [''],
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.fileSelected.emit(file);
  }
}
