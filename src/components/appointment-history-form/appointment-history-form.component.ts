import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppointmentsService } from '@services/appointments.service';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { take } from 'rxjs';

@Component({
  selector: 'app-appointment-history-form',
  standalone: true,
  templateUrl: './appointment-history-form.component.html',
  styleUrls: ['./appointment-history-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    TextareaModule,
    ButtonModule,
  ],
})
export class AppointmentHistoryFormComponent implements OnInit {
  historyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private cd: ChangeDetectorRef,
    private appoinmentService: AppointmentsService
  ) {}

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

    this.findAppointmentAndPatch();
  }

  private findAppointmentAndPatch(): void {
    this.appoinmentService.getAppointments().pipe(take(1)).subscribe((appointments) => {
      const appointment = appointments.find(
        (a) => a.id === this.dialogConfig.data.appointment.id
      );
      if (appointment) {
        this.historyForm.patchValue({
          reception: appointment.serviceHistory.reception,
        });
      }
    });
  }
}
