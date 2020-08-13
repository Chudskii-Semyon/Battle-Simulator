import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_ARMY_ERROR = 'COULD_NOT_CREATE_ARMY_ERROR';

export class CouldNotCreateArmyError extends HttpException {
  constructor(message = 'could not create new army') {
    super(
      {
        message,
        status: COULD_NOT_CREATE_ARMY_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
