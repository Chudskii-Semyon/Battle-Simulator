import { IsPositive } from 'class-validator';

export class BattleStartDto {
  @IsPositive()
  enemyArmyId: number
}