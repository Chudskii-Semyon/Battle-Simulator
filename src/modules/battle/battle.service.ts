import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { Operator, Soldier, Squad, Vehicle } from './composite';
import { InjectRepository } from '@nestjs/typeorm';
import { Army } from '../../entities/army.entity';
import { ArmyRepository } from '../armies/repositories/army.repository';
import { User } from '../../entities/user.entity';

@Injectable()
export class BattleService {
  private readonly loggerContext = this.constructor.name;
  private allySquads: Squad[] = [];
  private enemySquads: Squad[] = [];

  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Army)
    private readonly armyRepository: ArmyRepository,
  ) {}

  public async battleStart(enemyArmyId: number, user: User): Promise<void> {
    const armies = await this.armyRepository.find({
      where: [{ id: enemyArmyId }, { userId: user.id }],
      relations: ['squads', 'squads.soldiers', 'squads.vehicles', 'squads.vehicles.operators'],
    });

    armies.forEach(army => {
      if (army.userId === user.id) {
        this.allySquads = this.buildComposedSquad(army);
      } else {
        this.enemySquads = this.buildComposedSquad(army);
      }
    });
  }

  private squadAttack(squad: Squad): void {
    if (squad.getTotalHealthPoints() === 0) {
      return;
    }
  }

  private buildComposedSquad(army: Army): Squad[] {
    return army.squads.map(squad => {
      const squadUnit = new Squad();

      squad.vehicles.forEach(vehicle => {
        const { healthPoints, recharge } = vehicle;
        const vehicleUnit = new Vehicle(healthPoints, recharge);

        vehicle.operators.forEach(operator => {
          const { healthPoints, recharge } = operator;
          const operatorUnit = new Operator(healthPoints, recharge);

          vehicleUnit.addOperator(operatorUnit);
        });
        squadUnit.addUnit(vehicleUnit);
      });

      squad.soldiers.forEach(soldier => {
        const { healthPoints, recharge } = soldier;
        const soldierUnit = new Soldier(healthPoints, recharge);

        squadUnit.addUnit(soldierUnit);
      });

      return squadUnit;
    });
  }
}
