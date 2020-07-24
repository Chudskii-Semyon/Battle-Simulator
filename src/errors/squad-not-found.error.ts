import { HttpException, HttpStatus } from '@nestjs/common';

export const SQUAD_NOT_FOUND_ERROR = 'SQUAD_NOT_FOUND_ERROR';

export class SquadNotFoundError extends HttpException {
  constructor(squadId: number, message?: string) {
    super(
      {
        message: message || 'Could not find squad with id: ' + squadId,
        status: SQUAD_NOT_FOUND_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
