import { Operator } from '../../../entities/operator.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(Operator)
export class OperatorRepository extends Repository<Operator> {
  public async countOperatorsByVehicleIds(...vehicleIds: number[]): Promise<number> {
    return this.count({ where: { vehicleId: In(vehicleIds) } });
  }
}
