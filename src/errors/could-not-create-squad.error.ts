import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_SQUAD_ERROR = 'COULD_NOT_CREATE_SQUAD_ERROR';

export class CouldNotCreateSquadError extends HttpException {
  constructor(message = 'could not create new squad') {
    super(
      {
        message,
        status: COULD_NOT_CREATE_SQUAD_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
