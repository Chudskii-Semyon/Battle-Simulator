import { mockSquad } from './squad.mock';
import { mockConfig } from './config.mock';
import { Vehicle } from '../../entities/vehicle.entity';

export const mockVehicle = {
  id: 1,
  squadId: mockSquad.id,
  healthPoints: mockConfig.maxHealthPoints,
  recharge: 2000,
  operators: [],
} as Vehicle;
