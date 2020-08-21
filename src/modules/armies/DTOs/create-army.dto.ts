import { IsString, MaxLength, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateArmyDto {
  @Expose()
  @IsString()
  @MaxLength(30)
  @MinLength(3)
  public name: string;
}
