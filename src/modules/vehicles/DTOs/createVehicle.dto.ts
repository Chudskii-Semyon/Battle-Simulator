import { IsPositive } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateVehicleDto {
  @Expose()
  @IsPositive()
  public squadId: number;
}
