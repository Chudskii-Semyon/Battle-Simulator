import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_USER_ERROR =
  'COULD_NOT_CREATE_USER_ERROR';

export class CouldNotCreateUserError extends HttpException {
  constructor(message = 'could not create new user') {
    super(
      {
        message,
        status: COULD_NOT_CREATE_USER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}