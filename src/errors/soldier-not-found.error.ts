import { HttpException, HttpStatus } from '@nestjs/common';

export const SOLDIER_NOT_FOUND_ERROR = 'SOLDIER_NOT_FOUND_ERROR';

export class SoldierNotFoundError extends HttpException {
  constructor(soldierId: number, message?: string) {
    super(
      {
        message: message || 'Could not find soldier with id: ' + soldierId,
        status: SOLDIER_NOT_FOUND_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
