import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { StrategyEnum } from '../../../enums/strategy.enum';

export class CreateSquadDto {
  @Expose()
  @IsNumber()
  public armyId: number;

  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  public name: string;

  @Expose()
  @IsEnum(StrategyEnum)
  public strategy: StrategyEnum;
}
