import { Module } from '@nestjs/common';
import { BattleGateway } from './battle.gateway';
import { BattleService } from './battle.service';

@Module({
  providers: [BattleGateway, BattleService],
})
export class BattleModule {}
