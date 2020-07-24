import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigRepository } from './repositories/config.repository';
import { Config } from '../../entities/config.entity';
import { Squad } from '../../entities/squad';
import { SquadRepository } from '../squads/repositories/squad.repository';
import { LoggerService } from '../../logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Config, ConfigRepository, Squad, SquadRepository])],
  providers: [ConfigsService, LoggerService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
