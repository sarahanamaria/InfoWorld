import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-appointment-history-form',
  standalone: true,
  templateUrl: './appointment-history-form.component.html',
  styleUrls: ['./appointment-history-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    TextareaModule,
    ButtonModule
  ],
})
export class AppointmentHistoryFormComponent implements OnInit {
  historyForm!: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: DynamicDialogRef, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initForm();
    this.cd.detectChanges(); // get rid of ExpressionChangedAfterItHasBeenCheckedError
  }

  save(): void {
    if (this.historyForm.valid) {
      const formValue = this.historyForm.value;
      if (formValue.duration % 10 !== 0) {
        return;
      }
      this.dialogRef.close(formValue);
    }
  }

  private initForm(): void {
    this.historyForm = this.fb.group({
      reception: ['', Validators.required],
      processing: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(10)]],
    });
  }
}
