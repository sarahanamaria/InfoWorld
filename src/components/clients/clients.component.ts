import { Component } from '@angular/core';
import { AddClientFormComponent } from '@components/client-details-form/client-details-form.component';
import { ICar } from '@models/car.model';
import { IClient } from '@models/client.model';
import { EngineTypeEnum } from 'enums/engine-type.enum';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
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
export class ClientsComponent {
  clients: IClient[] = [
    {
      id: 1,
      firstName: 'Andrei',
      lastName: 'Ionescu',
      email: 'andrei.ionescu@mail.com',
      phoneNumbers: ['0723123456'],
      isClientActive: true,
      cars: [
        {
          id: 101,
          licensePlate: 'B-123-XYZ',
          chassis: 'WVWZZZ1JZXW000001',
          brand: 'Volkswagen',
          model: 'Golf 7',
          year: 2017,
          engineType: EngineTypeEnum.Diesel,
          isCarActive: true,
        },
      ],
    },
    {
      id: 2,
      firstName: 'Maria',
      lastName: 'Popa',
      email: 'maria.popa@gmail.com',
      phoneNumbers: ['0733555666', '0744999888'],
      isClientActive: true,
      cars: [
        {
          id: 102,
          licensePlate: 'CJ-98-POP',
          chassis: 'WDB12345678900001',
          brand: 'Mercedes-Benz',
          model: 'A-Class',
          year: 2021,
          engineType: EngineTypeEnum.Gasoline,
          isCarActive: true,
        },
        {
          id: 103,
          licensePlate: 'CJ-77-MRY',
          chassis: 'WDB98765432100001',
          brand: 'Renault',
          model: 'Clio',
          year: 2015,
          engineType: EngineTypeEnum.Hybrid,
          isCarActive: true,
        },
      ],
    },
    {
      id: 3,
      firstName: 'George',
      lastName: 'Stan',
      email: 'george.stan@example.com',
      phoneNumbers: ['0760111222'],
      isClientActive: true,
      cars: [],
    },
    {
      id: 4,
      firstName: 'Ioana',
      lastName: 'Mihai',
      email: 'ioana.mihai@domain.com',
      phoneNumbers: ['0722000111', '0733000222', '0744000333'],
      isClientActive: false,
      cars: [
        {
          id: 104,
          licensePlate: 'TM-10-IOA',
          chassis: '1HGCM82633A004352',
          brand: 'Honda',
          model: 'Civic',
          year: 2009,
          engineType: EngineTypeEnum.Gasoline,
          isCarActive: true,
        },
      ],
    },
    {
      id: 5,
      firstName: 'Daniel',
      lastName: 'Lupu',
      email: 'dan.lupu@yahoo.com',
      phoneNumbers: ['0755111222'],
      isClientActive: true,
      cars: [
        {
          id: 105,
          licensePlate: 'IF-44-DNL',
          chassis: 'WAUZZZ8K9AA000123',
          brand: 'Audi',
          model: 'A4',
          year: 2012,
          engineType: EngineTypeEnum.Diesel,
          isCarActive: true,
        },
        {
          id: 106,
          licensePlate: 'IF-55-TES',
          chassis: '5YJ3E1EA7HF000000',
          brand: 'Tesla',
          model: 'Model 3',
          year: 2020,
          engineType: EngineTypeEnum.Electric,
          isCarActive: true,
        },
      ],
    },
  ];
  dialogRef: DynamicDialogRef | null = null;

  expandedClientRows: { [key: number]: boolean } = {}; // table automatically sets which rows are expanded or not

  constructor(
    private dialogSerivce: DialogService,
    private messageService: MessageService
  ) {}

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

    this.dialogRef.onClose.pipe(take(1)).subscribe((clientData: IClient | undefined) => {
      if (clientData) {
        this.clients.push(clientData);

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
  }

  applyDisabledClasses(isActive: boolean): string {
    return isActive ? 'opacity-100' : 'opacity-20 pointer-events-none';
  }

  /**
   * Toggles the expanded state of a client row in the table
   * @param eventData - event data containing the client information
   * @param isExpanded - whether the row is expanded or collapsed
   */
  onClientToggle(eventData: TableRowExpandEvent<IClient> | TableRowCollapseEvent, isExpanded: boolean): void {
    const client = eventData.data;
    this.messageService.add({
      severity: 'info',
      summary: `Client ${isExpanded ? 'extins' : 'restrans'}`,
      detail: `${client.firstName} ${client.lastName}`,
      life: 2000,
    });
  }

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
      }
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((clientData: IClient | undefined) => {
      if (clientData) {
        const index = this.clients.findIndex((c) => {
          return c.id === clientData.id});
        if (index !== -1) {
          this.clients[index] = clientData;
          this.messageService.add({
            severity: 'success',
            summary: 'Client editat',
            detail: 'Datele despre client au fost actualizate!',
          });
        }
      }
    });

  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
