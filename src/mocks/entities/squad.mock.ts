import { Squad } from '../../entities/squad.entity';
import { StrategyEnum } from '../../enums/strategy.enum';
import { mockArmy } from './army.mock';

export const mockSquad = {
  id: 1,
  name: 'mock squad name',
  strategy: StrategyEnum.RANDOM,
  armyId: mockArmy.id,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Squad;
