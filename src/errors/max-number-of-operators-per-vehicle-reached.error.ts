import { HttpException, HttpStatus } from '@nestjs/common';

export const MAX_NUMBER_OF_OPERATORS_PER_VEHICLE_REACHED_ERROR =
  'MAX_NUMBER_OF_OPERATORS_PER_VEHICLE_REACHED_ERROR';

export class MaxNumberOfOperatorsPerVehicleReachedError extends HttpException {
  constructor(message = 'max number of operators per vehicle reached') {
    super(
      {
        message,
        status: MAX_NUMBER_OF_OPERATORS_PER_VEHICLE_REACHED_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
