import { mockSquad } from './squad.mock';
import { mockConfig } from './config.mock';
import { Soldier } from '../../entities/soldier.entity';

export const mockSoldier = {
  id: 1,
  squadId: mockSquad.id,
  healthPoints: mockConfig.maxHealthPoints,
  recharge: 2000,
  experience: 0,
} as Soldier;
