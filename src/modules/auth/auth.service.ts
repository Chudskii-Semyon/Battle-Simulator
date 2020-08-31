import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { SignUpDto } from './DTOs/signup.dto';
import { User } from '../../entities/user.entity';
import { LoggerService } from '../../logger/logger.service';
import { AuthDto } from './DTOs/auth.dto';
import { SignInDto } from './DTOs/signin.dto';
import { BcryptService } from '../common/services/bcrypt.service';
import { CouldNotAuthenticateUserError } from '../../errors/could-not-authenticate-user.error';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/DTOs/create-user.dto';

@Injectable()
export class AuthService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(signUpDto: SignUpDto): Promise<AuthDto> {
    const createUserDto = plainToClass(CreateUserDto, signUpDto);

    const createdUser = await this.usersService.createUser(createUserDto);

    return this.buildAuthDto(createdUser);
  }

  public async signIn(signInDto: SignInDto): Promise<AuthDto> {
    const { email, password } = signInDto;

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({ email });
      const isPasswordEquals = await this.bcryptService.compare(password, user.password);

      if (!isPasswordEquals) {
        this.logger.error(
          {
            message: `Error: passwords are not equal`,
          },
          new Error().stack,
          this.loggerContext,
        );
        throw new CouldNotAuthenticateUserError();
      }
    } catch (error) {
      this.logger.error(
        {
          message: `${error.message}`,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotAuthenticateUserError();
    }

    return this.buildAuthDto(user);
  }

  private buildAuthDto(user): AuthDto {
    return plainToClass(AuthDto, { user, token: this.jwtService.sign({ sub: user.id }) });
  }
}
