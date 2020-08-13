import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../DTOs/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../users/repositories/user.repository';
import { InvalidAuthTokenError } from '../../../errors/invalid-auth-token.error';
import { User } from '../../../entities/user.entity';
import { LoggerService } from '../../../logger/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO move to config
      secretOrKey: 'secret',
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
