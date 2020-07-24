import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_DELETE_ARMY_ERROR = 'COULD_NOT_DELETE_ARMY_ERROR';

export class CouldNotDeleteArmyError extends HttpException {
  constructor(armyId: number, message = 'could not delete army with id: ') {
    super(
      {
        message: message + armyId,
        status: COULD_NOT_DELETE_ARMY_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
