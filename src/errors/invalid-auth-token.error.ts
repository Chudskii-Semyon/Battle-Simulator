import { HttpException, HttpStatus } from '@nestjs/common';

export const INVALID_AUTH_TOKEN_ERROR = 'INVALID_AUTH_TOKEN_ERROR';

export class InvalidAuthTokenError extends HttpException {
  constructor(message = 'Invalid auth token') {
    super(
      {
        message,
        status: INVALID_AUTH_TOKEN_ERROR,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
