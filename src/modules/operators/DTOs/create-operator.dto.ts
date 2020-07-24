import { Expose } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class CreateOperatorDto {
  @Expose()
  @IsPositive()
  public vehicleId: number;
}
