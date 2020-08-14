import { Module } from '@nestjs/common';
import { SquadsController } from './squads.controller';
import { SquadsService } from './squads.service';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquadRepository } from './repositories/squad.repository';
import { ConfigsModule } from '../configs/configs.module';

@Module({
  imports: [AccessControlModule, ConfigsModule, TypeOrmModule.forFeature([SquadRepository])],
  controllers: [SquadsController],
  providers: [SquadsService, LoggerService],
  exports: [TypeOrmModule],
})
export class SquadsModule {}
