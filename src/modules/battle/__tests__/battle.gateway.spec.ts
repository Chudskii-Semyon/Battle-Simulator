import { Test, TestingModule } from '@nestjs/testing';
import { BattleGateway } from '../battle.gateway';
import { ArmyRepository } from '../../armies/repositories/army.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { BATTLE_SIMULATION_QUEUE_TOKEN } from '../constants/queues.constant';
import { BattleService } from '../battle.service';
import { BattleSimulationProcessor } from '../processors/battle-simulation.processor';
import { LoggerService } from '../../../logger/logger.service';
import { mockArmyRepository, mockUserRepository } from '../../../mocks/repositories';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('BattleGateway', () => {
  let gateway: BattleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([ArmyRepository, UserRepository]),
        BullModule.registerQueue({
          name: BATTLE_SIMULATION_QUEUE_TOKEN,
        }),
      ],
      providers: [BattleGateway, BattleService, BattleSimulationProcessor, LoggerService],
    })
      .overrideProvider(ArmyRepository)
      .useValue(mockArmyRepository)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    gateway = module.get<BattleGateway>(BattleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
