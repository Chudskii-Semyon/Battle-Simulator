import { HttpException, HttpStatus } from '@nestjs/common';

export const FORBIDDEN_RESOURCE_ERROR = 'FORBIDDEN_RESOURCE_ERROR';

export class ForbiddenResourceError extends HttpException {
  constructor(message = 'User do not have access to this source') {
    super(
      {
        message,
        status: FORBIDDEN_RESOURCE_ERROR,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
