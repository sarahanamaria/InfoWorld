import { EngineTypeEnum } from "enums/engine-type.enum";

export interface ICar {
  id: number;
  licensePlate: string;
  chassis: string;
  brand: string;
  model: string;
  year: number;
  engineType: EngineTypeEnum;
  engineCapacity: number; //cm^3
  horsepower: number;
  kilowatts: number;
}
