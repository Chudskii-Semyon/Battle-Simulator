import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';
import { sum } from 'lodash';

export class GetHealthPointsVisitor implements Visitor {
  public getTotalHealthPoints(...units: Unit[]): number {
    const healthPoints: number[] = units.map(unit => unit.accept(this));

    return sum(healthPoints);
  }

  public visitSoldier(soldier: Soldier): number {
    const { healthPoints } = soldier;

    return healthPoints;
  }

  public visitOperator(operator: Operator): number {
    const { healthPoints } = operator;

    return healthPoints;
  }

  public visitSquad(squad: Squad): number {
    const healthPoints: number[] = squad.units.map(unit => unit.accept(this));

    return sum(healthPoints);
  }

  public visitVehicle(vehicle: Vehicle): number {
    const { healthPoints } = vehicle;
    const operatorsHealthPoints: number[] = vehicle.operators.map(unit => unit.accept(this));

    const totalOperatorsMeanSuccess = sum(operatorsHealthPoints);

    return totalOperatorsMeanSuccess + healthPoints;
  }
}
