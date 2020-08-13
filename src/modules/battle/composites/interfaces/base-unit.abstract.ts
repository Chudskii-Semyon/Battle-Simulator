import { CreateUnitDto } from '../../DTOs/create-unit.dto';
import { Visitor } from '../../visitors/visitors.inerface';
import { Unit } from './unit.interface';

export class BaseUnit implements Unit {
  constructor(createUnitDto: CreateUnitDto) {
    const { id, healthPoints, recharge = 2000 } = createUnitDto;

    this._id = id;
    this._healthPoints = healthPoints;
    this._recharge = recharge;
  }

  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
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

  // eslint-disable-next-line
  accept(visitor: Visitor) {}

  getTotalHealthPoints(): number {
    return this.healthPoints;
  }

  isComposite(): boolean {
    return false;
  }

  filterInActiveUnits(): void {}

  getRechargeTime(): number {
    return this.recharge;
  }
}
