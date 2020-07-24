import { Expose } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class CreateSoldierDto {
  @Expose()
  @IsPositive()
  public squadId: number;
}
