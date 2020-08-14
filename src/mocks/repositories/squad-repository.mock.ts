import { mockSquad } from '../entities/squad.mock';

export const mockSquadRepository = {
  save: jest.fn().mockReturnValue(mockSquad),
  create: jest.fn().mockReturnValue(mockSquad),
  findOneOrFail: jest.fn().mockReturnValue(mockSquad),
  delete: jest.fn(),
};