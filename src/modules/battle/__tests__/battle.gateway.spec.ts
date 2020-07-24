import { Test, TestingModule } from '@nestjs/testing';
import { BattleGateway } from '../battle.gateway';

describe('BattleGateway', () => {
  let gateway: BattleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleGateway],
    }).compile();

    gateway = module.get<BattleGateway>(BattleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
