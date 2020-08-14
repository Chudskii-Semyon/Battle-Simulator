import { mockOperator } from '../entities/operator.mock';

export const mockOperatorRepository = {
  save: jest.fn().mockReturnValue(mockOperator),
  create: jest.fn().mockReturnValue(mockOperator),
  findOneOrFail: jest.fn().mockReturnValue(mockOperator),
  delete: jest.fn(),
};
