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
import { AppointmentFormComponent } from '@components/appointment-form/appointment-form/appointment-form.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-appointments',
  standalone: true,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  imports: [TableModule, ButtonModule, DynamicDialogModule, Toast],
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
    this.dialogRef = this.dialogService.open(AppointmentFormComponent, {
      header: 'Adauga programare',
      width: '500px',
      data: {
        clients: this.clients,
      },
    });

    this.dialogRef.onClose
      .pipe(take(1))
      .subscribe((newAppointment: IAppointment | undefined) => {
        if (newAppointment) {
          newAppointment.id = uuidv4();
          this.appointments.push(newAppointment);
          this.appointmentsService.updateAppointments(this.appointments);

          this.messageService.add({
            severity: 'success',
            summary: 'Programare adaugata',
            detail: 'Noua programare a fost salvata cu succes!',
          });
        }
      });
  }

  finalize(appointment: IAppointment) {
    appointment.status = 'finalizata';
    this.appointmentsService.updateAppointments(this.appointments);
    this.messageService.add({
      severity: 'success',
      summary: 'Finalizata',
      detail: 'Programarea a fost marcata ca finalizata',
    });
  }

  cancel(appointment: IAppointment) {
    appointment.status = 'anulata';
    this.appointmentsService.updateAppointments(this.appointments);
    this.messageService.add({
      severity: 'warn',
      summary: 'Anulata',
      detail: 'Programarea a fost anulata',
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
