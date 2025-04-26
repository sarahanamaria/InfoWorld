import { Routes } from '@angular/router';
import { ClientsComponent } from '../components/clients/clients.component';
import { AppointmentsComponent } from '../components/appointments/appointments.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: 'clients', component: ClientsComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: '**', redirectTo: 'clients'}
];
