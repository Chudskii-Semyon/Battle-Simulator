import { mockSoldier } from '../entities';

export const mockSoldierRepository = {
  save: jest.fn().mockReturnValue(mockSoldier),
  create: jest.fn().mockReturnValue(mockSoldier),
  findOneOrFail: jest.fn().mockReturnValue(mockSoldier),
  countSoldiersByArmyId: jest.fn().mockReturnValue(1),
  delete: jest.fn(),
};
