import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_ADD_PERMISSION_FOR_USER_ERROR = 'COULD_NOT_ADD_PERMISSION_FOR_USER_ERROR';

export class CouldNotAddPermissionForUserError extends HttpException {
  constructor(message = 'Could not add permission for user') {
    super(
      {
        message,
        status: COULD_NOT_ADD_PERMISSION_FOR_USER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
