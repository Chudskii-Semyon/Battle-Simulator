import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';

export class CalculateRechargeTimeVisitor implements Visitor {
  public calculateRechargeTime(...units: Unit[]): number {
    const rechargeTime = units.map(unit => unit.accept(this));

    return Math.max(...rechargeTime, units.length);
  }

  public visitSoldier(soldier: Soldier): number {
    return soldier.recharge;
  }

  public visitOperator(operator: Operator): number {
    return operator.recharge;
  }

  public visitSquad(squad: Squad): number {
    const recharges = squad.units.map(unit => unit.accept(this));

    return Math.max(...recharges);
  }

  public visitVehicle(vehicle: Vehicle): number {
    const recharges = vehicle.operators.map(unit => unit.accept(this));
    return Math.max(...recharges);
  }
}
