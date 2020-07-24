import { Operator } from '../../../entities/operator.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Operator)
export class OperatorRepository extends Repository<Operator> {}
