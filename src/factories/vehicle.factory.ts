import { define, factory } from 'typeorm-seeding';
import { Vehicle } from '../entities/vehicle.entity';
import { Squad } from '../entities/squad.entity';

define(Vehicle, faker => {
  // @ts-ignore
  const vehicle = new Vehicle();

  vehicle.squad = factory(Squad)() as any;

  return vehicle;
});
