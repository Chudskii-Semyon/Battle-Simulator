import { mockVehicle } from './vehicle.mock';
import { mockConfig } from './config.mock';
import { Operator } from '../../entities/operator.entity';

export const mockOperator = {
  id: 1,
  vehicleId: mockVehicle.id,
  healthPoints: mockConfig.maxHealthPoints,
  recharge: 2000,
  experience: 0,
} as Operator;
