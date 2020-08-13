import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_AUTHENTICATE_USER_ERROR = 'COULD_NOT_AUTHENTICATE_USER_ERROR';

export class CouldNotAuthenticateUserError extends HttpException {
  constructor(message = 'Could not authenticate user. Email or password are invalid') {
    super(
      {
        message,
        status: COULD_NOT_AUTHENTICATE_USER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
