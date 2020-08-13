import { Visitor } from '../../visitors/visitors.inerface';

export interface Unit {
  getTotalHealthPoints(): number;

  getRechargeTime(): number;

  isComposite(): boolean;

  accept(visitor: Visitor);

  filterInActiveUnits(): void;
}
