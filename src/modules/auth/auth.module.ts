import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { LoggerService } from '../../logger/logger.service';
import { BcryptService } from '../common/services/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Role } from '../../entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // TODO move to env / config
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LoggerService, BcryptService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
