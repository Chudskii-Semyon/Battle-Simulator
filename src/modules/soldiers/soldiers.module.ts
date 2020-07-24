import { Module } from '@nestjs/common';
import { SoldiersController } from './soldiers.controller';
import { SoldiersService } from './soldiers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Soldier } from '../../entities/soldier.entity';
import { SoldierRepository } from './repositories/soldier.repository';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { ConfigRepository } from '../configs/repositories/config.repository';
import { Config } from '../../entities/config.entity';
import { ConfigsService } from '../configs/configs.service';
import { SquadRepository } from '../squads/repositories/squad.repository';
import { Squad } from '../../entities/squad';
import { VehicleRepository } from '../vehicles/repositories/vehicle.repository';
import { Vehicle } from '../../entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Soldier,
      SoldierRepository,
      Config,
      ConfigRepository,
      Vehicle,
      VehicleRepository,
      Squad,
      SquadRepository,
    ]),
    AccessControlModule,
  ],
  controllers: [SoldiersController],
  providers: [SoldiersService, LoggerService, ConfigsService],
})
export class SoldiersModule {}
