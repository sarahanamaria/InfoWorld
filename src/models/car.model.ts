import { EngineTypeEnum } from "enums/engine-type.enum";

export interface ICar {
  id: string;
  licensePlate: string;
  chassis: string;
  brand: string;
  model: string;
  year: number;
  engineType: EngineTypeEnum;
  isCarActive: boolean;
}
