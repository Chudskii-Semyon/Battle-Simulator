import { define, factory } from 'typeorm-seeding';
import { Operator } from '../entities/operator.entity';
import { Vehicle } from '../entities/vehicle.entity';

define(Operator, faker => {
  // @ts-ignore
  const operator = new Operator();

  operator.vehicle = factory(Vehicle)() as any;

  return operator;
});
