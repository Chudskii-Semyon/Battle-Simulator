import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigRepository } from './repositories/config.repository';
import { SquadRepository } from '../squads/repositories/squad.repository';
import { LoggerService } from '../../logger/logger.service';
import { SoldierRepository } from '../soldiers/repositories/soldier.repository';
import { VehicleRepository } from '../vehicles/repositories/vehicle.repository';
import { OperatorRepository } from '../operators/repositories/operator.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfigRepository,
      SquadRepository,
      SoldierRepository,
      VehicleRepository,
      OperatorRepository,
    ]),
  ],
  providers: [ConfigsService, LoggerService],
  exports: [ConfigsService, TypeOrmModule],
})
export class ConfigsModule {}
