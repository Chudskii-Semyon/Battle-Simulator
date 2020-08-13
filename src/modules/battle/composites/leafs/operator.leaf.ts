import { CreateUnitDto } from '../../DTOs/create-unit.dto';
import { Visitor } from '../../visitors/visitors.inerface';
import { BaseUnit } from '../interfaces/base-unit.abstract';

export class Operator extends BaseUnit {
  constructor(createUnitDto: CreateUnitDto) {
    super(createUnitDto);
  }

  private _experience = 0;

  get experience(): number {
    return this._experience;
  }

  set experience(value: number) {
    this._experience = value;
  }

  accept(visitor: Visitor): any {
    return visitor.visitOperator(this);
  }
}