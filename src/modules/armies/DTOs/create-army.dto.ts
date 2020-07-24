import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { StrategyEnum } from '../../../enums/strategy.enum';
import { Expose } from 'class-transformer';

export class CreateArmyDto {
  @Expose()
  @IsString()
  @MaxLength(30)
  @MinLength(3)
  public name: string;

  @Expose()
  @IsEnum(StrategyEnum)
  public strategy: StrategyEnum = StrategyEnum.RANDOM;
}
