import { mockSquad } from '../entities';

export const mockSquadRepository = {
  save: jest.fn().mockReturnValue(mockSquad),
  create: jest.fn().mockReturnValue(mockSquad),
  find: jest.fn().mockReturnValue([mockSquad, mockSquad]),
  findOneOrFail: jest.fn().mockReturnValue(mockSquad),
  countSquadsByArmyId: jest.fn().mockReturnValue(1),
  delete: jest.fn(),
};
