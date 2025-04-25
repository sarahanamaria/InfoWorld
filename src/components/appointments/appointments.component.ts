import { Component, OnInit } from '@angular/core';
import IAppointment from '@models/appointment.model';
import { IClient } from '@models/client.model';
import { AppointmentsService } from '@services/appointments.service';
import { ClientsService } from '@services/clients.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { Toast } from 'primeng/toast';
import { AppointmentFormComponent } from '@components/appointment-form/appointment-form.component';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentStatusEnum } from 'enums/appointment-status.enum';
import { AppointmentHistoryFormComponent } from '@components/appointment-history-form/appointment-history-form.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-appointments',
  standalone: true,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  imports: [TableModule, ButtonModule, DynamicDialogModule, Toast, TooltipModule],
  providers: [
    AppointmentsService,
    ClientsService,
    MessageService,
    DialogService,
  ],
})
export class AppointmentsComponent implements OnInit {
  appointments: IAppointment[] = [];
  clients: IClient[] = [];
  dialogRef: DynamicDialogRef | null = null;
  expandedAppointmentRows: { [key: string]: boolean } = {};

  readonly appointmentStatusEnum = AppointmentStatusEnum;
  readonly isAdmin = true;

  constructor(
    private appointmentsService: AppointmentsService,
    private clientsService: ClientsService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadClients();
  }

  addAppointment(): void {
    this.dialogService
      .open(AppointmentFormComponent, {
        header: 'Adauga programare',
        width: '500px',
        closable: true,
        modal: true,
        data: {
          clients: this.clients,
          isAdmin: this.isAdmin,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((newAppointment: IAppointment | undefined) => {
        if (newAppointment) {
          newAppointment.id = uuidv4();
          this.appointments.push(newAppointment);
          this.saveAppointments('Programare adaugata');
        }
      });
  }

  cancel(appointment: IAppointment): void {
    appointment.status = AppointmentStatusEnum.Canceled;
    this.saveAppointments('Programarea a fost anulata');
  }

  editAppointment(appointment: IAppointment): void {
    this.dialogService
      .open(AppointmentFormComponent, {
        header: 'Editeaza programare',
        width: '500px',
        closable: true,
        modal: true,
        data: {
          clients: this.clients,
          existingAppointment: appointment,
          isAdmin: this.isAdmin,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((updatedAppointment: IAppointment | undefined) => {
        if (updatedAppointment) {
          const index: number = this.appointments.findIndex(
            (a: IAppointment) => a.id === updatedAppointment.id
          );
          if (index !== -1) {
            this.appointments[index] = updatedAppointment;
            this.saveAppointments('Programarea a fost actualizata');
          }
        }
      });
  }

  finalizeWithHistory(appointment: IAppointment): void {
    this.dialogRef = this.dialogService.open(AppointmentHistoryFormComponent, {
      header: 'Istoric service',
      width: '500px',
      modal: true,
      closable: true,
      data: {
        appointment
      }
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((historyData) => {
      if (historyData) {
        const index: number = this.appointments.findIndex((app: IAppointment) => app.id === appointment.id);
        if (index !== -1) {
          this.appointments[index] = {
            ...appointment,
            status: AppointmentStatusEnum.Finalized,
            serviceHistory: {
              reception: historyData.reception,
              processing: historyData.processing,
              duration: historyData.duration,
            },
          };
          this.saveAppointments('Programarea a fost finalizata cu istoric.');
        }
      }
    });
  }

  onAppointmentToggle(event: any, expand: boolean): void {
    const appointment = event.data as IAppointment;
    if (expand) {
      this.expandedAppointmentRows[appointment.id] = true;
    } else {
      delete this.expandedAppointmentRows[appointment.id];
    }
  }

  private saveAppointments(message: string): void {
    this.appointmentsService.updateAppointments(this.appointments);
    this.messageService.add({
      severity: 'success',
      summary: 'Succes',
      detail: message,
    });
  }

  private loadAppointments(): void {
    this.appointmentsService
      .getAppointments()
      .pipe(take(1))
      .subscribe((data) => {
        this.appointments = data;
      });
  }

  private loadClients(): void {
    this.clientsService
      .getClients()
      .pipe(take(1))
      .subscribe((data) => {
        this.clients = data;
      });
  }
}
