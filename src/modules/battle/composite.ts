import { sum, sumBy } from 'lodash';
import { geometricMean, randomRange } from '../../utils';

interface Unit {
  getTotalHealthPoints(): number;

  isComposite(): boolean;

  accept(visitor: Visitor);

  filterInActiveUnits(): void;
}

class BaseUnit implements Unit {
  constructor(hp: number, recharge: number) {
    this._healthPoints = hp;
    this._recharge = recharge;
  }

  private _healthPoints: number;

  get healthPoints(): number {
    return this._healthPoints;
  }

  set healthPoints(value: number) {
    this._healthPoints = value;
  }

  private _recharge: number;

  get recharge(): number {
    return this._recharge;
  }

  set recharge(value: number) {
    this._recharge = value;
  }

  accept(visitor: Visitor) {}

  getTotalHealthPoints(): number {
    return this.healthPoints;
  }

  isComposite(): boolean {
    return false;
  }

  filterInActiveUnits(): void {}
}

export class Squad implements Unit {
  public units: Unit[] = [];

  accept(visitor: Visitor): any {
    return visitor.visitSquad(this);
  }

  addUnit(unit: Unit): void {
    this.units.push(unit);
  }

  getTotalHealthPoints(): number {
    const healthPoints = this.units.map(unit => unit.getTotalHealthPoints());

    return sum(healthPoints);
  }

  isComposite(): boolean {
    return true;
  }

  filterInActiveUnits(): void {
    this.units = this.units.filter(unit => unit.getTotalHealthPoints() <= 0);
  }
}

export class Vehicle extends BaseUnit {
  public operators: Unit[] = [];

  constructor(hp: number, recharge: number) {
    super(hp, recharge);
  }

  isComposite(): boolean {
    return true;
  }

  accept(visitor: Visitor): any {
    return visitor.visitVehicle(this);
  }

  filterInActiveUnits(): void {
    this.operators = this.operators.filter(operator => operator.getTotalHealthPoints() <= 0);
  }

  public addOperator(unit: Unit): void {
    this.operators.push(unit);
  }

  public removeOperator(unit: Unit): void {
    this.operators = this.operators.filter(
      _unit => unit.getTotalHealthPoints() !== _unit.getTotalHealthPoints(),
    );
  }

  getTotalHealthPoints(): number {
    const healthPoints = this.operators.map(operator => operator.getTotalHealthPoints());
    return sum(healthPoints);
  }
}

export class Soldier extends BaseUnit {
  constructor(hp: number, recharge: number) {
    super(hp, recharge);
  }

  private _experience = 0;

  get experience(): number {
    return this._experience;
  }

  accept(visitor: Visitor): any {
    return visitor.visitSoldier(this);
  }
}

export class Operator extends BaseUnit {
  constructor(hp: number, recharge: number) {
    super(hp, recharge);
  }

  private _experience = 0;

  get experience(): number {
    return this._experience;
  }

  accept(visitor: Visitor): any {
    return visitor.visitOperator(this);
  }
}

interface Visitor {
  visitVehicle(vehicle: Vehicle);

  visitSoldier(soldier: Soldier);

  visitOperator(operator: Operator);

  visitSquad(squad: Squad);
}

export class InflictBaseDamageVisitor implements Visitor {
  constructor(damage: number) {
    this._damage = damage;
  }

  private _damage: number;

  get damage(): number {
    return this._damage;
  }

  public inflictDamage(units: Unit[]): void {
    units.forEach(unit => unit.accept(this));
  }

  public visitSoldier(soldier: Soldier): void {
    soldier.healthPoints -= this.damage;
  }

  public visitOperator(operator: Operator): void {
    operator.healthPoints -= this.damage;
  }

  public visitSquad(squad: Squad): void {
    squad.units.map(unit => unit.accept(this));
  }

  public visitVehicle(vehicle: Vehicle): void {
    const { operators } = vehicle;

    operators.forEach(operator => {
      operator.accept(this);

      // if (operator.getTotalHealthPoints() <= 0) {
      if (true) {
        vehicle.removeOperator(operator);
      }
    });
    vehicle.healthPoints -= this.damage;
  }
}

export class CalculateBaseAttackDamageVisitor implements Visitor {
  public calculateAttackDamage(units: Unit[]): number {
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

export class CalculateBaseAttackSuccessVisitor implements Visitor {
  public calculateAttackSuccess(units: Unit[]): number {
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
