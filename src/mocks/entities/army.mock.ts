import { Army } from '../../entities/army.entity';
import { mockUser } from './user.mock';

export const mockArmy = {
  id: 1,
  userId: mockUser.id,
  name: 'mock army name',
  createdAt: new Date(),
  updatedAt: new Date(),
} as Army;
