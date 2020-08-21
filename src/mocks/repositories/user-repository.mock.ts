import { mockUser } from '../entities';

export const mockUserRepository = {
  save: jest.fn().mockReturnValue(mockUser),
  create: jest.fn().mockReturnValue(mockUser),
  findOneOrFail: jest.fn().mockReturnValue(mockUser),
  delete: jest.fn(),
};
