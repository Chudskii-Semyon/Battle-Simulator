import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { User } from '../../entities/user.entity';
import { CouldNotCreateUserError } from '../../errors/could-not-create-user.error';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    let savedUser: User;
    try {
      const createdUser = this.userRepository.create(createUserDto);

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
          user: createUserDto,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateUserError();
    }

    return savedUser;
  }
}
