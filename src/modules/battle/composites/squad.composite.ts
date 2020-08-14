import { StrategyEnum } from '../../../enums/strategy.enum';
import { Visitor } from '../visitors/visitors.inerface';
import { sum } from 'lodash';
import { Unit } from './interfaces/unit.interface';

export class Squad implements Unit {
  public units: Unit[] = [];

  constructor(strategy: StrategyEnum) {
    this._strategy = strategy;
  }

  private _strategy: StrategyEnum;

  get strategy(): StrategyEnum {
    return this._strategy;
  }

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
    this.units.forEach(unit => unit.filterInActiveUnits());
    this.units = this.units.filter(unit => unit.getTotalHealthPoints() > 0);
  }

  getRechargeTime(): number {
    return 0;
  }

  getType(): string {
    return this.constructor.name;
  }
}
