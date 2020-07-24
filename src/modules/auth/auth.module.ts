import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { User } from '../../entities/user.entity';
import { LoggerService } from '../../logger/logger.service';
import { BcryptService } from '../common/services/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { RoleRepository } from './repositories/role.repository';
import { Role } from '../../entities/role.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
// import { AccessControlModule } from '../access-control/access-control.module';
// import { AccessControlService } from '../access-control/access-control.service';

@Module({
  imports: [
    // AccessControlModule,
    TypeOrmModule.forFeature([User, UserRepository, Role, RoleRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // TODO move to env / config
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    AuthService,
    LoggerService,
    BcryptService,
    JwtStrategy,
    // AccessControlService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
