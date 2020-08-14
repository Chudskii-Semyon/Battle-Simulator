import { Module } from '@nestjs/common';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';
import { OperatorRepository } from './repositories/operator.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from '../access-control/access-control.module';
import { LoggerService } from '../../logger/logger.service';
import { ConfigsModule } from '../configs/configs.module';

@Module({
  imports: [TypeOrmModule.forFeature([OperatorRepository]), AccessControlModule, ConfigsModule],
  controllers: [OperatorsController],
  providers: [OperatorsService, LoggerService],
  exports: [TypeOrmModule],
})
export class OperatorsModule {}
