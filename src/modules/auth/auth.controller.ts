import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './DTOs/signup.dto';
import { LoggerService } from '../../logger/logger.service';
import { SignInDto } from './DTOs/signin.dto';
import { AuthDto } from './DTOs/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly loggerContext = this.constructor.name;

  constructor(private readonly authService: AuthService, private readonly logger: LoggerService) {}

  @Post('signup')
  public async signUp(@Body() signUpDto: SignUpDto): Promise<AuthDto> {
    this.logger.debug(
      {
        message: 'Got signup input',
        signUp: signUpDto,
      },
      this.loggerContext,
    );

    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  public async signIn(@Body() signInDto: SignInDto): Promise<AuthDto> {
    this.logger.debug(
      {
        message: `Got sign in input`,
        signIn: signInDto,
      },
      this.loggerContext,
    );

    return this.authService.signIn(signInDto);
  }
}
