import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../DTOs/jwt-payload.dto';
import { UserRepository } from '../../users/repositories/user.repository';
import { InvalidAuthTokenError } from '../../../errors/invalid-auth-token.error';
import { User } from '../../../entities/user.entity';
import { LoggerService } from '../../../logger/logger.service';
import { CONFIG_TOKEN } from '../../../config/constants/config.constant';
import { IConfigSchema } from '../../../config/interfaces/schema.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @Inject(CONFIG_TOKEN)
    private readonly config: IConfigSchema,
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    const { sub } = payload;

    try {
      return await this.userRepository.findOneOrFail(sub);
    } catch (error) {
      this.logger.error(
        {
          message: `User not found by sub from parsed token. Error: ${error.message}`,
          payload,
        },
        error.stack,
        this.loggerContext,
      );

      throw new InvalidAuthTokenError();
    }
  }
}
