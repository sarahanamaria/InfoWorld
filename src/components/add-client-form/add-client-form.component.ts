import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-add-client-form',
  imports: [FloatLabel, ReactiveFormsModule, InputText, TagModule, Button, Tooltip],
  templateUrl: './add-client-form.component.html',
  styleUrl: './add-client-form.component.scss',
})
export class AddClientFormComponent {
  clientForm!: FormGroup;
  phoneNumberControl!: FormControl;
  phoneNumbersArray!: FormArray;
  showClientForm: boolean = true;

  constructor(private fb: FormBuilder, private dialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.initForm();
  }

  addPhoneNumber(): void {
    const number = this.phoneNumberControl?.value.trim();
    if (number) {
      this.phoneNumbersArray.push(new FormControl(number));
      this.phoneNumberControl.setValue('');
    }
  }

  removePhoneNumber(index: number): void {
    this.phoneNumbersArray.removeAt(index);
  }

  submitClient(): void {
    if (this.clientForm.valid) {
      this.showClientForm = false;
    }
  }

  saveData(): void {
    this.dialogRef.close(this.clientForm.value)
  }

  private initForm(): void {
    this.phoneNumbersArray = this.fb.array([]);
    this.phoneNumberControl = this.fb.control('', Validators.minLength(10));

    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: this.phoneNumberControl,
      phoneNumbers: this.phoneNumbersArray,
    });
  }
}
