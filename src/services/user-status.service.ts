import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private isUserAdmin = new BehaviorSubject<boolean>(false);

  constructor() {}

  setIsAdmin(value: boolean): void {
    this.isUserAdmin.next(value);
  }

  getIsAdmin(): Observable<boolean> {
    return this.isUserAdmin.asObservable();
  }
}
