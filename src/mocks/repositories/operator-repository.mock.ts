import { mockOperator } from '../entities';

export const mockOperatorRepository = {
  save: jest.fn().mockReturnValue(mockOperator),
  create: jest.fn().mockReturnValue(mockOperator),
  findOneOrFail: jest.fn().mockReturnValue(mockOperator),
  delete: jest.fn(),
  countOperatorsByVehicleIds: jest.fn().mockReturnValue(1),
};
