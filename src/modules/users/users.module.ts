import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import { LoggerService } from '../../logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService, LoggerService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
