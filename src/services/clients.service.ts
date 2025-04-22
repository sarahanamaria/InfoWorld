import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { IClient } from '@models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  getClients(): Observable<IClient[]> {
    const clientsFromStorage: string | null = localStorage.getItem('clients');
    if (clientsFromStorage) {
      return of(JSON.parse(clientsFromStorage));
    }

    // use http to get data from public folder to show in request tab
    return this.http.get<IClient[]>('/db/clients.json').pipe(
      tap((clients: IClient[]) => {
        localStorage.setItem('clients', JSON.stringify(clients));
      })
    );
  }

  updateClients(clients: IClient[]): void {
    localStorage.setItem('clients', JSON.stringify(clients));
  }
}
