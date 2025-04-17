import { ICar } from './car.model';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  cars: ICar[];
  isUserActive: boolean;
}
