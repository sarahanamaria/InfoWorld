import { ICar } from "@models/car.model";
import { IClient } from "@models/client.model";

export default interface IAppointment {
  id: string;
  client: IClient;
  car: ICar;
  method: 'email' | 'telefon' | 'in_persoana';
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'programata' | 'finalizata' | 'anulata';
}
