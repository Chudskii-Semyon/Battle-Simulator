import { mockConfig } from '../entities';

export const mockConfigRepository = {
  save: jest.fn().mockReturnValue(mockConfig),
  create: jest.fn().mockReturnValue(mockConfig),
  findOneOrFail: jest.fn().mockReturnValue(mockConfig),
  findActiveConfig: jest.fn().mockReturnValue(mockConfig),
  delete: jest.fn(),
};
