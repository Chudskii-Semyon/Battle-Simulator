import { Test, TestingModule } from '@nestjs/testing';
import { BattleService } from '../battle.service';
import { BATTLE_SIMULATION_QUEUE_TOKEN } from '../constants/queues.constant';
import { BullModule } from '@nestjs/bull';
import { BattleGateway } from '../battle.gateway';
import { BattleSimulationProcessor } from '../processors/battle-simulation.processor';
import { LoggerService } from '../../../logger/logger.service';
import { ArmyRepository } from '../../armies/repositories/army.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockArmyRepository, mockUserRepository } from '../../../mocks/repositories';

describe('BattleService', () => {
  let service: BattleService;

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

    service = module.get<BattleService>(BattleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
