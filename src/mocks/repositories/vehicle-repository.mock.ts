import { mockVehicle } from '../entities/vehicle.mock';

export const mockVehicleRepository = {
  save: jest.fn().mockReturnValue(mockVehicle),
  create: jest.fn().mockReturnValue(mockVehicle),
  findOneOrFail: jest.fn().mockReturnValue(mockVehicle),
  delete: jest.fn(),
};
