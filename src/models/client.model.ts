import { ICar } from './car.model';

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  cars: ICar[];
  isClientActive: boolean;
}
