import { HttpException, HttpStatus } from '@nestjs/common';

export const MAX_UNITS_PER_SQUAD_HAS_BEEN_REACHED_ERROR =
  'MAX_UNITS_PER_SQUAD_HAS_BEEN_REACHED_ERROR';

export class MaxUnitsPerSquadHasBeenReachedError extends HttpException {
  constructor(message = 'Maximum number of units per squad has been reached') {
    super(
      {
        message,
        status: MAX_UNITS_PER_SQUAD_HAS_BEEN_REACHED_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
