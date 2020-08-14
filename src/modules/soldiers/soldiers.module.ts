import { Module } from '@nestjs/common';
import { SoldiersController } from './soldiers.controller';
import { SoldiersService } from './soldiers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldierRepository } from './repositories/soldier.repository';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { ConfigsModule } from '../configs/configs.module';

@Module({
  imports: [TypeOrmModule.forFeature([SoldierRepository]), ConfigsModule, AccessControlModule],
  controllers: [SoldiersController],
  providers: [SoldiersService, LoggerService],
  exports: [TypeOrmModule],
})
export class SoldiersModule {}
