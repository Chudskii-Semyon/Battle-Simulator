import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_ACCESS_RULE_ERROR = 'COULD_NOT_ADD_PERMISSION_FOR_USER_ERROR';

export class CouldNotCreateAccessRuleError extends HttpException {
  constructor(message = 'Could not create access rule for created unit') {
    super(
      {
        message,
        status: COULD_NOT_CREATE_ACCESS_RULE_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
