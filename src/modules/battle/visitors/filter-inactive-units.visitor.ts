import { Visitor } from './visitors.inerface';
import { Squad } from '../composites/squad.composite';
import { Unit } from '../composites/interfaces/unit.interface';
import { Soldier } from '../composites/leafs/soldier.leaf';
import { Operator } from '../composites/leafs/operator.leaf';
import { Vehicle } from '../composites/vehicle.composite';

export class FilterInActiveUnitsVisitor implements Visitor {
  public filterInActiveUnits(...units: Unit[]): void {
    units.filter(unit => {
      // console.log('unit =>', unit);
      unit.accept(this);
      return unit.getTotalHealthPoints() > 0;
    });
  }

  public visitSoldier(soldier: Soldier): void {
    if (soldier.healthPoints <= 0) {
      soldier.healthPoints = 0;
    }
  }

  public visitOperator(operator: Operator): void {
    if (operator.healthPoints <= 0) {
      operator.healthPoints = 0;
    }
  }

  public visitSquad(squad: Squad): void {
    squad.units = squad.units.filter(unit => {
      unit.accept(this);
      return unit.getTotalHealthPoints() > 0;
    });
  }

  public visitVehicle(vehicle: Vehicle): void {
    vehicle.operators = vehicle.operators.filter(operator => {
      operator.accept(this);

      return operator.getTotalHealthPoints() <= 0;
    });

    if (!vehicle.operators.length) {
      vehicle.healthPoints = 0;
    }
  }
}
