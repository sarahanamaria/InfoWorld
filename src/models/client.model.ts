import { ICar } from './car.model';

export interface IClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  cars: ICar[];
  isClientActive: boolean;
}
