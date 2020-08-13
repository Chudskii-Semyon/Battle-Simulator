import { EntityRepository, Repository } from 'typeorm';
import { Squad } from '../../../entities/squad';

@EntityRepository(Squad)
export class SquadRepository extends Repository<Squad> {
  public async countSquadsByArmyId(armyId: number): Promise<number> {
    return this.count({ armyId });
  }
}
