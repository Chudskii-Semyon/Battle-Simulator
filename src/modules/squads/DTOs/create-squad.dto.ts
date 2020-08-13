import { Expose } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSquadDto {
  @Expose()
  @IsNumber()
  public armyId: number;

  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  public name: string;
}
