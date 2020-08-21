import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';
import { geometricMean, randomRange } from '../../../utils/math.util';
import { sum } from 'lodash';

export class CalculateBaseAttackSuccessVisitor implements Visitor {
  public calculateAttackSuccess(...units: Unit[]): number {
    const rates: number[] = units.map(unit => unit.accept(this));

    return sum(rates);
  }

  public visitSoldier(soldier: Soldier): number {
    const { experience, healthPoints } = soldier;

    return (0.5 * ((1 + healthPoints / 100) * randomRange(50 + experience, 100))) / 100;
  }

  public visitOperator(operator: Operator): number {
    const { experience, healthPoints } = operator;

    return (0.5 * ((1 + healthPoints / 100) * randomRange(50 + experience, 100))) / 100;
  }

  public visitSquad(squad: Squad): number {
    const rates: number[] = squad.units.map(unit => unit.accept(this));

    return sum(rates);
  }

  public visitVehicle(vehicle: Vehicle): number {
    const { healthPoints } = vehicle;
    const rates: number[] = vehicle.operators.map(unit => unit.accept(this));

    const operatorsMeanSuccess = geometricMean(rates);

    return 0.5 * (1 + healthPoints / 100) * operatorsMeanSuccess;
  }
}
