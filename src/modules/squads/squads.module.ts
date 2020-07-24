import { Module } from '@nestjs/common';
import { SquadsController } from './squads.controller';
import { SquadsService } from './squads.service';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Squad } from '../../entities/squad';
import { SquadRepository } from './repositories/squad.repository';
import { ConfigsService } from '../configs/configs.service';
import { Config } from '../../entities/config.entity';
import { ConfigRepository } from '../configs/repositories/config.repository';
import { Soldier } from '../../entities/soldier.entity';
import { SoldierRepository } from '../soldiers/repositories/soldier.repository';
import { Vehicle } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../vehicles/repositories/vehicle.repository';

@Module({
  imports: [
    AccessControlModule,
    TypeOrmModule.forFeature([
      Squad,
      SquadRepository,
      Config,
      ConfigRepository,
      Soldier,
      SoldierRepository,
      Vehicle,
      VehicleRepository,
    ]),
  ],
  controllers: [SquadsController],
  providers: [SquadsService, ConfigsService, LoggerService],
})
export class SquadsModule {}
