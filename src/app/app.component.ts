import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RoutingPathsEnum } from '../enums/routing-paths.enum';

@Component({
  selector: 'app-root',
  imports: [MenubarModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Clienti',
      icon: 'pi pi-user',
      routerLink: RoutingPathsEnum.Clients,
    },
    {
      label: 'Programari Clienti',
      icon: 'pi pi-clock',
      routerLink: RoutingPathsEnum.Appointments,
    },
    {
      label: 'Istoric Service',
      icon: 'pi pi-history',
      routerLink: RoutingPathsEnum.History,
    },
  ];
}
