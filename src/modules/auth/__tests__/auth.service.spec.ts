import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { LoggerService } from '../../../logger/logger.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { mockUserRepository } from '../../../mocks/repositories';
import { UsersService } from '../../users/users.service';
import { ConfigModule } from '../../../config/config.module';
import { IConfigSchema } from '../../../config/interfaces/schema.interface';
import { CONFIG_TOKEN } from '../../../config/constants/config.constant';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
