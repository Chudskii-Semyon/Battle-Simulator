import { Module } from '@nestjs/common';
import { ArmiesController } from './armies.controller';
import { ArmiesService } from './armies.service';
import { LoggerService } from '../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Army } from '../../entities/army.entity';
import { ArmyRepository } from './repositories/army.repository';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [TypeOrmModule.forFeature([Army, ArmyRepository]), AccessControlModule],
  controllers: [ArmiesController],
  providers: [ArmiesService, LoggerService],
})
export class ArmiesModule {}
