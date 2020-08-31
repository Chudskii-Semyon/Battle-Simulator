import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly loggerContext = this.constructor.name;

  constructor(private readonly logger: LoggerService) {}

  @Get('/me')
  private getCurrentUser(@WithUser() user: User): Promise<User> {
    this.logger.debug(
      {
        message: `Proceed getCurrentUser`,
        user,
      },
      this.loggerContext,
    );
    return Promise.resolve(user);
  }
}
