import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddClientFormComponent } from '@components/client-details-form/client-details-form.component';
import { ICar } from '@models/car.model';
import { IClient } from '@models/client.model';
import { ClientsService } from '@services/clients.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { take } from 'rxjs';

@Component({
  selector: 'app-clients',
  imports: [
    TableModule,
    TooltipModule,
    ButtonModule,
    DynamicDialogModule,
    Toast,
  ],
  providers: [DialogService, MessageService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: IClient[] = [];
  dialogRef: DynamicDialogRef | null = null;

  expandedClientRows: { [key: number]: boolean } = {}; // table automatically sets which rows are expanded or not

  constructor(
    private dialogSerivce: DialogService,
    private messageService: MessageService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.getClients();
  }

  /**
   * Adds a new client by opening a dialog with the form
   */
  addClient(): void {
    this.dialogRef = this.dialogSerivce.open(AddClientFormComponent, {
      header: 'Adauga un client',
      closable: true,
      closeOnEscape: true,
      modal: true, // background is restricted if opened
      width: '500px',
      height: 'auto',
    });

    this.dialogRef.onClose
      .pipe(take(1))
      .subscribe((clientData: IClient | undefined) => {
        if (clientData) {
          this.clients.push(clientData);
          this.clientsService.updateClients(this.clients);

          this.messageService.add({
            severity: 'success',
            summary: 'Client adaugat',
            detail: 'Datele despre client si masini au fost salvate!',
          });
        }
      });
  }

  /**
   * Disables or enables a client and all of its cars
   * @param client - client to be deleted
   */
  changeClientStatus(client: IClient): void {
    client.isClientActive = !client.isClientActive;

    client.cars.forEach((car: ICar) => {
      car.isCarActive = client.isClientActive;
    });

    this.clientsService.updateClients(this.clients);
  }

  /**
   * Disables or enables a car and updates the client status accordingly
   * @param car - car to be deleted
   */
  changeCarStatus(car: ICar): void {
    car.isCarActive = !car.isCarActive;

    const client: IClient | undefined = this.clients.find((client) =>
      client.cars.some((c) => c.id === car.id)
    );

    if (client) {
      client.isClientActive = client.cars.some((c) => c.isCarActive);
    }

    this.clientsService.updateClients(this.clients);
  }

  applyDisabledClasses(isActive: boolean): string {
    return isActive ? 'opacity-100' : 'opacity-20 pointer-events-none';
  }

  /**
   * Toggles the expanded state of a client row in the table
   * @param eventData - event data containing the client information
   * @param isExpanded - whether the row is expanded or collapsed
   */
  onClientToggle(
    eventData: TableRowExpandEvent<IClient> | TableRowCollapseEvent,
    isExpanded: boolean
  ): void {
    const client = eventData.data;
    this.messageService.add({
      severity: 'info',
      summary: `Client ${isExpanded ? 'extins' : 'restrans'}`,
      detail: `${client.firstName} ${client.lastName}`,
      life: 2000,
    });
  }

  /**
   * Opens a dialog to edit the client details
   * @param client
   */
  editClient(client: IClient): void {
    this.dialogRef = this.dialogSerivce.open(AddClientFormComponent, {
      header: `Editeaza clientul ${client.firstName} ${client.lastName}`,
      closable: true,
      closeOnEscape: true,
      modal: true, // background is restricted if opened
      width: '500px',
      height: 'auto',
      data: {
        clientData: client,
        isClientEdited: true,
      },
    });

    this.dialogRef.onClose
      .pipe(take(1))
      .subscribe((clientData: IClient | undefined) => {
        if (clientData) {
          const index = this.clients.findIndex((c) => {
            return c.id === clientData.id;
          });
          if (index !== -1) {
            this.clients[index] = clientData;
            this.clientsService.updateClients(this.clients);
            this.messageService.add({
              severity: 'success',
              summary: 'Client editat',
              detail: 'Datele despre client au fost actualizate!',
            });
          }
        }
      });
  }

  /**
   * Opens a dialog to edit the car details
   * @param car
   * @param client
   */
  editCar(car: ICar, client: IClient): void {
    this.dialogRef = this.dialogSerivce.open(AddClientFormComponent, {
      header: `Editeaza masina ${car.brand} ${car.model}`,
      closable: true,
      closeOnEscape: true,
      modal: true, // background is restricted if opened
      width: '500px',
      height: 'auto',
      data: {
        carData: car,
        clientData: client,
        isCarEdited: true,
      },
    });

    this.dialogRef.onClose
      .pipe(take(1))
      .subscribe((carData: ICar | undefined) => {
        if (carData) {
          const index = client.cars.findIndex((c) => c.id === carData.id);
          if (index !== -1) {
            client.cars[index] = carData;
            this.clientsService.updateClients(this.clients);
            this.messageService.add({
              severity: 'success',
              summary: 'Masina editata',
              detail: 'Datele despre masina au fost actualizate!',
            });
          }
        }
      });
  }

  /**
   * Deletes a client from the list and shows a message
   * @param client
   */
  deleteClient(client: IClient): void {
    const index = this.clients.findIndex((c) => c.id === client.id);
    if (index !== -1) {
      this.clients.splice(index, 1);
      this.clientsService.updateClients(this.clients);
      this.messageService.add({
        severity: 'warn',
        summary: 'Client sters',
        detail: 'Clientul a fost sters!',
      });
    }
  }

  /**
   * Deletes a car from the list and shows a message
   * @param car - car to be deleted
   * @param client - client to be updated
   */
  deleteCar(car: ICar, client: IClient): void {
    const index = client.cars.findIndex((c) => c.id === car.id);
    if (index !== -1) {
      client.cars.splice(index, 1);
      this.clientsService.updateClients(this.clients);
      this.messageService.add({
        severity: 'warn',
        summary: 'Masina stearsa',
        detail: 'Masina a fost stearsa!',
      });
    }
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  private getClients(): void {
    this.clientsService.getClients()
    .pipe(take(1))
    .subscribe((data: IClient[]) => {
      this.clients = data;
    });
  }
}
