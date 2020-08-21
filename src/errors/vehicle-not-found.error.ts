import { HttpException, HttpStatus } from '@nestjs/common';

export const VEHICLE_NOT_FOUND_ERROR = 'VEHICLE_NOT_FOUND_ERROR';

export class VehicleNotFoundError extends HttpException {
  constructor(vehicleId: number, message?: string) {
    super(
      {
        message: message || 'Could not find vehicle with id: ' + vehicleId,
        status: VEHICLE_NOT_FOUND_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
