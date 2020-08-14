import { Visitor } from '../../visitors/visitors.inerface';

export interface Unit {
  getTotalHealthPoints(): number;

  getRechargeTime(): number;

  isComposite(): boolean;

  getType(): string;

  accept(visitor: Visitor);

  filterInActiveUnits(): void;
}
