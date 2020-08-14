import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';

export class InflictBaseDamageVisitor implements Visitor {
  constructor(damage: number) {
    this._damage = damage;
  }

  private _damage: number;

  get damage(): number {
    return this._damage;
  }

  set damage(value: number) {
    this._damage = value;
  }

  public inflictDamage(...units: Unit[]): void {
    units.forEach(unit => unit.accept(this));
  }

  public visitSoldier(soldier: Soldier): void {
    soldier.healthPoints -= this.damage;

    if (soldier.healthPoints < 0) {
      soldier.healthPoints = 0;
    }
    console.log(`Soldier got ${this.damage} damage. Left ${soldier.healthPoints} HP.`);
  }

  public visitOperator(operator: Operator): void {
    operator.healthPoints -= this.damage;

    if (operator.healthPoints < 0) {
      operator.healthPoints = 0;
    }
    console.log(
      `Operator ( ${operator.id} ) got ${this.damage} damage. Left ${operator.healthPoints} HP.`,
    );
  }

  public visitSquad(squad: Squad): void {
    squad.units.map(unit => unit.accept(this));
  }

  public visitVehicle(vehicle: Vehicle): void {
    const { operators } = vehicle;
    const randomOperatorIndex = Math.floor(Math.random() * operators.length);
    const damage = this.damage;

    operators.forEach((operator, index) => {
      if (index === randomOperatorIndex) {
        this.damage = damage * 0.2;
      } else {
        this.damage = damage * 0.1;
      }
      operator.accept(this);
    });

    vehicle.healthPoints = vehicle.healthPoints - damage * 0.6;

    if (vehicle.healthPoints <= 0) {
      vehicle.healthPoints = 0;
    }
    console.log(`Vehicle got ${(damage / 100) * 60} damage. Left ${vehicle.healthPoints} HP.`);
    this.damage = damage;
  }
}
