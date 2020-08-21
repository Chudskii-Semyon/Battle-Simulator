import { Soldier } from '../../../entities/soldier.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Soldier)
export class SoldierRepository extends Repository<Soldier> {
  public async countSoldiersBySquadId(squadId: number): Promise<number> {
    return this.count({ squadId });
  }
}
