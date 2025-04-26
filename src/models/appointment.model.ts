import { ICar } from "@models/car.model";
import { IClient } from "@models/client.model";
import IServiceHistory from "@models/service-history.model";
import { AppointmentMethodEnum } from "enums/appointment-method.enum";
import { AppointmentStatusEnum } from "enums/appointment-status.enum";

export default interface IAppointment {
  id: string;
  client: IClient;
  car: ICar;
  method: AppointmentMethodEnum;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatusEnum;
  contactValue?: string; // optional, for pgone or email methods
  serviceHistory: IServiceHistory;
}
