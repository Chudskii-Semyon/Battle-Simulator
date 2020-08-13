import { Module } from '@nestjs/common';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';
import { Operator } from '../../entities/operator.entity';
import { OperatorRepository } from './repositories/operator.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { Config } from '../../entities/config.entity';
import { ConfigRepository } from '../configs/repositories/config.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator, OperatorRepository, Config, ConfigRepository]),
    AccessControlModule,
  ],
  controllers: [OperatorsController],
  providers: [OperatorsService, LoggerService],
})
export class OperatorsModule {}
