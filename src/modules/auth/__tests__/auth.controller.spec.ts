import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { UserRepository } from '../../users/repositories/user.repository';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { LoggerService } from '../../../logger/logger.service';
import { BcryptService } from '../../common/services/bcrypt.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { mockUserRepository } from '../../../mocks/repositories';
import { ConfigModule } from '../../../config/config.module';
import { IConfigSchema } from '../../../config/interfaces/schema.interface';
import { CONFIG_TOKEN } from '../../../config/constants/config.constant';
import { mockUser } from '../../../mocks/entities';
import { SignUpDto } from '../DTOs/signup.dto';
import { AuthDto } from '../DTOs/auth.dto';
import { SignInDto } from '../DTOs/signin.dto';

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeAll(async () => {
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
      controllers: [AuthController],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', function() {
    it('should return create user', async function() {
      const signUpDto: SignUpDto = {
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      };
      const signupSpy = jest.spyOn(service, 'signUp').mockResolvedValueOnce(mockUser);

      const result = await service.signUp(signUpDto);

      expect(result).toBe(mockUser);
      expect(signupSpy).toBeCalledWith(signUpDto);
    });
  });

  describe('signIn', function() {
    it('should return auth token', async function() {
      const signInDto: SignInDto = {
        email: mockUser.email,
        password: mockUser.password,
      };

      const authDto: AuthDto = {
        token: 'mock auth token',
      };

      const signInSpy = jest.spyOn(service, 'signIn').mockResolvedValueOnce(authDto);

      const result = await service.signIn(signInDto);

      expect(result).toBe(authDto);
      expect(signInSpy).toBeCalledWith(signInDto);
    });
  });
});
