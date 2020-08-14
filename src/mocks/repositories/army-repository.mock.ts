import { mockArmy } from '../entities';

export const mockArmyRepository = {
  save: jest.fn().mockReturnValue(mockArmy),
  create: jest.fn().mockReturnValue(mockArmy),
  findOneOrFail: jest.fn().mockReturnValue(mockArmy),
  delete: jest.fn(),
};
