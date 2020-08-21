import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_SOLDIER_ERROR = 'COULD_NOT_CREATE_SOLDIER_ERROR';

export class CouldNotCreateSoldierError extends HttpException {
  constructor(message = 'could not create new soldier') {
    super(
      {
        message,
        status: COULD_NOT_CREATE_SOLDIER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
