import { HttpException, HttpStatus } from '@nestjs/common';

export const OPERATOR_NOT_FOUND_ERROR = 'OPERATOR_NOT_FOUND_ERROR';

export class OperatorNotFoundError extends HttpException {
  constructor(operatorId: number, message?: string) {
    super(
      {
        message: message || 'Could not find operator with id: ' + operatorId,
        status: OPERATOR_NOT_FOUND_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
