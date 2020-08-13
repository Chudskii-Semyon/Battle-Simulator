import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleRepository } from './repositories/vehicle.repository';
import { Vehicle } from '../../entities/vehicle.entity';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { ConfigsService } from '../configs/configs.service';
import { Config } from '../../entities/config.entity';
import { ConfigRepository } from '../configs/repositories/config.repository';
import { Squad } from '../../entities/squad';
import { SquadRepository } from '../squads/repositories/squad.repository';
import { Soldier } from '../../entities/soldier.entity';
import { SoldierRepository } from '../soldiers/repositories/soldier.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleRepository,
      Vehicle,
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
  controllers: [VehiclesController],
  providers: [VehiclesService, LoggerService, ConfigsService],
})
export class VehiclesModule {}
