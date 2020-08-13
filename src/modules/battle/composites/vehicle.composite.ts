import { CreateUnitDto } from '../DTOs/create-unit.dto';
import { Visitor } from '../visitors/visitors.inerface';
import { sum } from 'lodash';
import { BaseUnit } from './interfaces/base-unit.abstract';
import { Unit } from './interfaces/unit.interface';

export class Vehicle extends BaseUnit {
  public operators: Unit[] = [];

  constructor(createUnitDto: CreateUnitDto) {
    super(createUnitDto);
  }

  isComposite(): boolean {
    return true;
  }

  accept(visitor: Visitor): any {
    return visitor.visitVehicle(this);
  }

  filterInActiveUnits(): void {
    this.operators = this.operators.filter(operator => operator.getTotalHealthPoints() > 0);

    if (this.operators.length <= 0) {
      this.healthPoints = 0;
    }
  }

  public addOperator(unit: Unit): void {
    this.operators.push(unit);
  }

  getTotalHealthPoints(): number {
    const healthPoints = this.operators.map(operator => operator.getTotalHealthPoints());
    return sum(healthPoints);
  }
}
