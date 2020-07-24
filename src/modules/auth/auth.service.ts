import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';
import { SignUpDto } from './DTOs/signup.dto';
import { User } from '../../entities/user.entity';
import { CouldNotCreateUserError } from '../../errors/could-not-create-user.error';
import { LoggerService } from '../../logger/logger.service';
import { AuthDto } from './DTOs/auth.dto';
import { SignInDto } from './DTOs/signin.dto';
import { BcryptService } from '../common/services/bcrypt.service';
import { CouldNotAuthenticateUserError } from '../../errors/could-not-authenticate-user.error';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { RoleRepository } from './repositories/role.repository';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { CouldNotAddPermissionForUserError } from '../../errors/could-not-add-permission-for-user.error';
// import { AccessControlService } from '../access-control/access-control.service';

@Injectable()
export class AuthService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    private readonly logger: LoggerService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService, // private readonly accessControlService: AccessControlService,
  ) {}

  public async signUp(signUpDto: SignUpDto): Promise<User> {
    const defaultRole = await this.roleRepository.findOneOrFail({ name: UserRoleEnum.DEFAULT });

    let savedUser: User;
    try {
      const createdUser = this.userRepository.create({ ...signUpDto, role: defaultRole });

      this.logger.debug(
        {
          message: `Saving user to database`,
          user: createdUser,
        },
        this.loggerContext,
      );

      savedUser = await this.userRepository.save(createdUser);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not create user. Error: ${error.message}`,
          user: signUpDto,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateUserError();
    }

    // try {
    // actions = this.accessControlService.buildActions();

    // const isSuccess = await this.accessControlService.addPermissionForUser(
    //   savedUser.id.toString(),
    //   resource,
    //   actions,
    // );

    // if (!isSuccess) {
    //   throw new CouldNotAddPermissionForUserError();
    // }

    return savedUser;
    // } catch (error) {
    //   this.logger.error(
    //     {
    //       message: error.message,
    //       actions,
    //     },
    //     error.stack,
    //     this.loggerContext,
    //   );
    //   throw new CouldNotAddPermissionForUserError();
    // }
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

    return plainToClass(AuthDto, { token: this.jwtService.sign({ sub: user.id }) });
  }
}
