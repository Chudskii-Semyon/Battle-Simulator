import { ConnectionOptions } from 'typeorm';

export interface IConfigSchema {
  port: number;
  discount: {
    percent: number;
    numberOfMonths: number;
  };
  auth: {
    secret: string;
    expirationTimeSeconds: number;
  };
  casbinEnforcer: {
    pathToModel: string;
  };
  typeorm: ConnectionOptions;
  unitDefaults: {
    unitRechargeTime: {
      vehicle: number;
      soldier: number;
    };
    unitHealthPoints: {
      vehicle: number;
      soldier: number;
    };
  };
}
