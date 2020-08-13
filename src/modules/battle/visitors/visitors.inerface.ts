import { Squad } from '../composites/squad.composite';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';

export interface Visitor {
  visitVehicle(vehicle: Vehicle);

  visitSoldier(soldier: Soldier);

  visitOperator(operator: Operator);

  visitSquad(squad: Squad);
}
