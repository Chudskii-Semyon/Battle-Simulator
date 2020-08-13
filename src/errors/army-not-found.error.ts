import { HttpException, HttpStatus } from '@nestjs/common';

export const ARMY_NOT_FOUND_ERROR = 'ARMY_NOT_FOUND_ERROR';

export class ArmyNotFoundError extends HttpException {
  constructor(armyId: number, message?: string) {
    super(
      {
        message: message || 'Could not find army with id: ' + armyId,
        status: ARMY_NOT_FOUND_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
