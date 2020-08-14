import { Module } from '@nestjs/common';
import { BattleGateway } from './battle.gateway';
import { BattleService } from './battle.service';
import { BattleSimulationProcessor } from './processors/battle-simulation.processor';
import { BATTLE_SIMULATION_QUEUE_TOKEN } from './constants/queues.constant';
import { BullModule } from '@nestjs/bull';
import { LoggerService } from '../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArmyRepository } from '../armies/repositories/army.repository';
import { UserRepository } from '../users/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArmyRepository, UserRepository]),
    BullModule.registerQueue({
      name: BATTLE_SIMULATION_QUEUE_TOKEN,
    }),
  ],
  providers: [BattleGateway, BattleService, BattleSimulationProcessor, LoggerService],
})
export class BattleModule {}
