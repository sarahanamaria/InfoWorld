import { Component, OnInit } from '@angular/core';
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
import { CommonModule, formatDate } from '@angular/common';
import { ICar } from '@models/car.model';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { AppointmentMethodEnum } from 'enums/appointment-method.enum';
import { AppointmentStatusEnum } from 'enums/appointment-status.enum';

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
    InputTextModule,
    CommonModule,
  ],
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  clients: IClient[] = [];
  selectedClientCars: ICar[] = [];

  contactMethods = [
    { label: 'Email', value: AppointmentMethodEnum.Email },
    { label: 'Telefon', value: AppointmentMethodEnum.Phone },
    { label: 'In persoana', value: AppointmentMethodEnum.InPerson },
  ];

  startTimeSlots: string[] = [];
  endTimeSlots: string[] = [];
  minDate: Date = new Date();

  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.initializeClients();
    this.isAdmin = this.dialogConfig.data.isAdmin;
    this.initForm();
    this.generateTimeSlots();
    this.handleExistingAppointment();
  }

  onClientChange(client: IClient): void {
    const selected = this.clients.find((c) => c.id === client.id);
    this.selectedClientCars = selected?.cars ?? [];
    this.appointmentForm.patchValue({ carId: null });
  }

  save(): void {
    if (this.appointmentForm.valid) {
      const date: IAppointment = this.appointmentForm.value;
      const id: string = this.dialogConfig.data?.existingAppointment?.id ?? '';
      const appointment: IAppointment = {
        ...date,
        contactValue:
          date.method === AppointmentMethodEnum.Phone || date.method === AppointmentMethodEnum.Email
            ? date.contactValue
            : undefined,
        client: date.client,
        car: date.car,
        method: date.method,
        description: date.description,
        date: formatDate(date.date, 'dd-MM-yyyy', 'en'),
        startTime: date.startTime,
        endTime: date.endTime,
        status: AppointmentStatusEnum.Scheduled,
        serviceHistory: {
          processing: '',
          reception: this.appointmentForm.value.description,
          duration: 0,
        },
        id,
      };

      this.dialogRef.close(appointment);
    }
  }

  private initializeClients(): void {
    this.clients = this.dialogConfig.data.clients.filter(
      (client: IClient) =>
        client.isClientActive && client.cars && client.cars.length > 0
    );
  }

  private handleExistingAppointment(): void {
    const existingAppointment = this.dialogConfig.data?.existingAppointment;
    if (existingAppointment) {
      this.patchFormWithExistingAppointment(existingAppointment);
    }
  }

  private patchFormWithExistingAppointment(existing: IAppointment): void {
    this.appointmentForm.patchValue({
      client: existing.client,
      car: existing.car,
      method: existing.method,
      contactValue: existing.contactValue,
      date: new Date(existing.date.split('-').reverse().join('-')),
      startTime: existing.startTime ?? null,
      endTime: existing.endTime ?? null,
      description: existing.description,
    });
  }

  private initForm(): void {
    this.appointmentForm = this.fb.group({
      client: [null, Validators.required],
      car: [null, Validators.required],
      method: [null, Validators.required],
      contactValue: [''],
      date: [new Date(), Validators.required],
      startTime: [null],
      endTime: [null],
      description: ['', Validators.required],
    });
  }

  private generateTimeSlots(): void {
    this.startTimeSlots = [];
    this.endTimeSlots = [];

    for (let hour = 8; hour < 17; hour++) {
      this.startTimeSlots.push(`${hour}:00`);
      if (hour <= 16) {
        this.startTimeSlots.push(`${hour}:30`);
      }
    }

    for (let hour = 8; hour <= 17; hour++) {
      if (hour > 8) {
        this.endTimeSlots.push(`${hour}:00`);
      }
      if (hour < 17) {
        this.endTimeSlots.push(`${hour}:30`);
      }
    }
  }
}
