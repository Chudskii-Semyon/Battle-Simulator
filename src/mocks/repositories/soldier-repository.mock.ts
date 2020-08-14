import { mockSoldier } from '../entities/soldier.mock';

export const mockSoldierRepository = {
  save: jest.fn().mockReturnValue(mockSoldier),
  create: jest.fn().mockReturnValue(mockSoldier),
  findOneOrFail: jest.fn().mockReturnValue(mockSoldier),
  delete: jest.fn(),
};