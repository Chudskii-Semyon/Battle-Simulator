import { Vehicle } from '../../../entities/vehicle.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle> {
  public async countVehiclesBySquadId(squadId: number): Promise<number> {
    return this.count({ squadId });
  }
}
