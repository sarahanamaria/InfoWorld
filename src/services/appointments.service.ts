import { Injectable } from '@angular/core';
import IAppointment from '@models/appointment.model';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  getAppointments(): Observable<IAppointment[]> {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      return of(JSON.parse(stored));
    }

    return of([]);
  }

  updateAppointments(appointments: IAppointment[]): void {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
}
