import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';
import { randomRange } from '../../../utils';
import { sum, sumBy } from 'lodash';

export class CalculateBaseAttackDamageVisitor implements Visitor {
  public calculateAttackDamage(...units: Unit[]): number {
    const total: number[] = units.map(unit => unit.accept(this));

    return sum(total);
  }

  public visitSoldier(soldier: Soldier): number {
    const { experience, healthPoints } = soldier;

    return (0.5 * ((1 + healthPoints / 100) * randomRange(50 + experience, 100))) / 100;
  }

  public visitOperator(operator: Operator): number {
    return operator.experience / 100;
  }

  public visitSquad(squad: Squad): number {
    const rates: number[] = squad.units.map(unit => unit.accept(this));

    return sum(rates);
  }

  public visitVehicle(vehicle: Vehicle): number {
    const { operators } = vehicle;

    const operatorsDamage = sumBy(operators, operator => operator.accept(this));

    return 0.1 + operatorsDamage;
  }
}
