import { EntityRepository, Repository } from 'typeorm';
import { Army } from '../../../entities/army.entity';

@EntityRepository(Army)
export class ArmyRepository extends Repository<Army> {}
