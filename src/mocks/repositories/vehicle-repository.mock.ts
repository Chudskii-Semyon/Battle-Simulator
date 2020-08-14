import { mockVehicle } from '../entities';

export const mockVehicleRepository = {
  save: jest.fn().mockReturnValue(mockVehicle),
  create: jest.fn().mockReturnValue(mockVehicle),
  findOneOrFail: jest.fn().mockReturnValue(mockVehicle),
  countVehiclesBySquadId: jest.fn().mockResolvedValue(1),
  delete: jest.fn(),
};
