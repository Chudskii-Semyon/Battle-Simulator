import { HttpException, HttpStatus } from '@nestjs/common';

export const MAX_NUMBER_OF_SQUADS_HAS_BEEN_REACHED_ERROR =
  'MAX_NUMBER_OF_SQUADS_HAS_BEEN_REACHED_ERROR';

export class MaxNumberOfSquadsHasBeenReachedError extends HttpException {
  constructor(message = 'Maximum number of squads per army has been reached.') {
    super(
      {
        message,
        status: MAX_NUMBER_OF_SQUADS_HAS_BEEN_REACHED_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
