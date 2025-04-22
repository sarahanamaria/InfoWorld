import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import IAppointment from '@models/appointment.model';
import { IClient } from '@models/client.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { formatDate } from '@angular/common';
import { ICar } from '@models/car.model';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    DatePickerModule,
  ],
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  clients: IClient[] = [];
  selectedClientCars: ICar[] = [];

  contactMethods = [
    { label: 'Email', value: 'email' },
    { label: 'Telefon', value: 'telefon' },
    { label: 'In persoana', value: 'in_persoana' },
  ];

  startTimeSlots: string[] = [];
  endTimeSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.clients = this.dialogConfig.data.clients.filter(
      (client: IClient) =>
        client.isClientActive && client.cars && client.cars.length > 0
    );
    this.initForm();
    this.generateTimeSlots();
  }

  onClientChange(client: IClient): void {
    const selected = this.clients.find((c) => c.id === client.id);
    this.selectedClientCars = selected?.cars ?? [];
    this.appointmentForm.patchValue({ carId: null });
  }

  save(): void {
    if (this.appointmentForm.valid) {
      const date = this.appointmentForm.value;
      const appointment: IAppointment = {
        ...date,
        client: date.client,
        car: date.car,
        method: date.method,
        description: date.description,
        date: formatDate(date.date, 'dd-MM-yyyy', 'en'),
        startTime: date.startTime,
        endTime: date.endTime,
        status: 'programata',
        id: '',
      };

      this.dialogRef.close(appointment);
    }
  }

  private initForm(): void {
    this.appointmentForm = this.fb.group({
      client: [null, Validators.required],
      car: [null, Validators.required],
      method: [null, Validators.required],
      date: [new Date(), Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  private generateTimeSlots(): void {
    this.startTimeSlots = [];
    this.endTimeSlots = [];

    for (let hour = 8; hour <= 17; hour++) {
      this.startTimeSlots.push(`${hour}:30`);
      if (hour < 17) {
        this.startTimeSlots.push(`${hour + 1}:00`);
      }
    }

    for (let hour = 9; hour <= 18; hour++) {
      this.endTimeSlots.push(`${hour}:00`);
      if (hour < 18) {
        this.endTimeSlots.push(`${hour}:30`);
      }
    }
  }
}
