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
import { UsersService } from '../users/users.service';
import { ConfigModule } from '../../config/config.module';
import { IConfigSchema } from '../../config/interfaces/schema.interface';
import { CONFIG_TOKEN } from '../../config/constants/config.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: IConfigSchema) => {
        return {
          secret: config.auth.secret,
          signOptions: { expiresIn: config.auth.expirationTimeSeconds },
        };
      },
      inject: [CONFIG_TOKEN],
    }),
  ],
  providers: [AuthService, UsersService, LoggerService, BcryptService, JwtStrategy],
  controllers: [AuthController],
  exports: [TypeOrmModule],
})
export class AuthModule {}
