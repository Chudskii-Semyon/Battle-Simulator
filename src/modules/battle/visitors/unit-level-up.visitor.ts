import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';

export class UnitLevelUpVisitor implements Visitor {
  public levelUp(...units: Unit[]): void {
    units.forEach(unit => unit.accept(this));
  }

  public visitSoldier(soldier: Soldier): void {
    soldier.experience = this.incrementExperience(soldier.experience);
    soldier.recharge = this.updateRecharge(soldier.recharge);
  }

  public visitOperator(operator: Operator): void {
    operator.experience = this.incrementExperience(operator.experience);
    operator.recharge = this.updateRecharge(operator.recharge);
  }

  public visitSquad(squad: Squad): void {
    squad.units.map(unit => unit.accept(this));
  }

  public visitVehicle(vehicle: Vehicle): void {
    vehicle.operators.forEach(operator => {
      operator.accept(this);
    });
  }

  private incrementExperience(experience: number): number {
    if (experience < 50) {
      return experience + 1;
    }

    return experience;
  }

  private updateRecharge(recharge: number): number {
    if (recharge >= 225) {
      return recharge - 25;
    }

    return recharge;
  }
}
