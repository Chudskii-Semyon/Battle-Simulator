import { Vehicle } from '../../entities/vehicle.entity';
import { mockSquad } from './squad.mock';
import { mockConfig } from './config.mock';

export const mockVehicle = {
  id: 1,
  squadId: mockSquad.id,
  healthPoints: mockConfig.maxHealthPoints,
  recharge: 2000,
} as Vehicle;
