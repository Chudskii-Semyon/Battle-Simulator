import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleRepository } from './repositories/vehicle.repository';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { ConfigsModule } from '../configs/configs.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleRepository]), AccessControlModule, ConfigsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, LoggerService],
  exports: [TypeOrmModule],
})
export class VehiclesModule {}
