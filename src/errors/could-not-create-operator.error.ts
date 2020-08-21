import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_OPERATOR_ERROR = 'COULD_NOT_CREATE_OPERATOR_ERROR';

export class CouldNotCreateOperatorError extends HttpException {
  constructor(message = 'could not create new operator') {
    super(
      {
        message,
        status: COULD_NOT_CREATE_OPERATOR_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
