import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RoutingPathsEnum } from '../enums/routing-paths.enum';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { UserStatusService } from '@services/user-status.service';

@Component({
  selector: 'app-root',
  imports: [MenubarModule, RouterOutlet, ButtonModule, TooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isAdmin = false;

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
  ];

  constructor(private userStatusService: UserStatusService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAdminStatus()
  }

  setAdminStatus(): void {
    this.userStatusService.setIsAdmin(!this.isAdmin);
  }

  private getAdminStatus(): void {
    this.userStatusService.getIsAdmin().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
  }
}
