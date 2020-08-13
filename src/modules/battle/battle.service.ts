import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Army } from '../../entities/army.entity';
import { ArmyRepository } from '../armies/repositories/army.repository';
import { User } from '../../entities/user.entity';
import { StrategyEnum } from '../../enums/strategy.enum';
import { Squad } from './composites/squad.composite';
import { FilterInActiveUnitsVisitor } from './visitors/filter-inactive-units.visitor';
import { GetHealthPointsVisitor } from './visitors/get-health-points.visitior';
import { CalculateBaseAttackSuccessVisitor } from './visitors/calculate-base-attack-success.visitor';
import { CalculateBaseAttackDamageVisitor } from './visitors/calculate-base-attack-damage.visitior';
import { InflictBaseDamageVisitor } from './visitors/inflict-base-damage.visitor';
import { Server } from 'socket.io';
import { plainToClass } from 'class-transformer';
import { CreateUnitDto } from './DTOs/create-unit.dto';
import { UnitLevelUpVisitor } from './visitors/unit-level-up.visitor';
import { CalculateRechargeTimeVisitor } from './visitors/calculate-recharge-time.visitor';
import { Vehicle } from './composites/vehicle.composite';
import { Operator } from './composites/leafs/operator.leaf';
import { Soldier } from './composites/leafs/soldier.leaf';
import { BATTLE_END, SQUAD_ATTACK } from './constants/socket-events.constant';

@Injectable()
export class BattleService {
  public socket: Server = null;
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
        this.allySquads = this.buildComposedSquads(army);
      } else {
        this.enemySquads = this.buildComposedSquads(army);
      }
    });

    this.allySquads.forEach(squad => {
      this.squadAttack(squad, this.enemySquads);
    });

    this.enemySquads.forEach(squad => {
      this.squadAttack(squad, this.allySquads);
    });
  }

  private squadAttack(attacker: Squad, defenders: Squad[]): void {
    this.filterSquads();

    if (this.checkWinner()) {
      this.socket.emit(BATTLE_END);
      return;
    }

    // TODO move to visitors
    const defenderIndex = this.selectSquadToAttack(attacker.strategy, defenders);

    const defender = defenders[defenderIndex];

    const calculateAttackSuccessVisitor = new CalculateBaseAttackSuccessVisitor();

    const defenderSuccess = calculateAttackSuccessVisitor.calculateAttackSuccess(defender);
    const attackerSuccess = calculateAttackSuccessVisitor.calculateAttackSuccess(attacker);

    if (attackerSuccess > defenderSuccess) {
      const attackDamageVisitor = new CalculateBaseAttackDamageVisitor();
      const damage = attackDamageVisitor.calculateAttackDamage(defender);

      const inflictDamageVisitor = new InflictBaseDamageVisitor(damage);
      inflictDamageVisitor.inflictDamage(defender);

      const unitLevelUpVisitor = new UnitLevelUpVisitor();
      unitLevelUpVisitor.levelUp(attacker);
    }

    const calculateRechargeTimeVisitor = new CalculateRechargeTimeVisitor();
    const rechargeTime = calculateRechargeTimeVisitor.calculateRechargeTime(attacker);

    setTimeout(() => this.squadAttack(attacker, defenders), rechargeTime);
    // } else {
    //   const calculateRechargeTimeVisitor = new CalculateRechargeTimeVisitor();
    //   const rechargeTime = calculateRechargeTimeVisitor.calculateRechargeTime(attacker);
    //
    //   setTimeout(() => this.squadAttack(attacker, defenders), rechargeTime);
    // }
  }

  private buildComposedSquads(army: Army): Squad[] {
    return army.squads.map(squad => {
      const squadUnit = new Squad(squad.strategy);

      squad.vehicles.forEach(vehicle => {
        const createUnitDto = plainToClass(CreateUnitDto, vehicle);
        const vehicleUnit = new Vehicle(createUnitDto);

        vehicle.operators.forEach(operator => {
          const createUnitDto = plainToClass(CreateUnitDto, operator);
          const operatorUnit = new Operator(createUnitDto);

          vehicleUnit.addOperator(operatorUnit);
        });
        squadUnit.addUnit(vehicleUnit);
      });

      squad.soldiers.forEach(soldier => {
        const createUnitDto = plainToClass(CreateUnitDto, soldier);
        const soldierUnit = new Soldier(createUnitDto);

        squadUnit.addUnit(soldierUnit);
      });

      return squadUnit;
    });
  }

  private checkWinner(): boolean {
    const getHealthPointsVisitor = new GetHealthPointsVisitor();

    const allyHealthPoints = getHealthPointsVisitor.getTotalHealthPoints(...this.allySquads);
    const enemyHealthPoints = getHealthPointsVisitor.getTotalHealthPoints(...this.enemySquads);

    return allyHealthPoints <= 0 || enemyHealthPoints <= 0;
  }

  private filterSquads() {
    const filterUnitsVisitor = new FilterInActiveUnitsVisitor();

    filterUnitsVisitor.filterInActiveUnits(...this.enemySquads);
    filterUnitsVisitor.filterInActiveUnits(...this.allySquads);

    this.enemySquads = this.enemySquads.filter(squad => !!squad.units.length);
    this.allySquads = this.allySquads.filter(squad => !!squad.units.length);
  }

  private selectSquadToAttack(strategy: StrategyEnum, squads: Squad[]): number {
    switch (strategy) {
      case StrategyEnum.STRONGEST: {
        return this.findStrongestSquadIndex(squads);
      }
      case StrategyEnum.WEAKEST: {
        return this.findWeakestSquadIndex(squads);
      }
      default: {
        return Math.floor(Math.random() * squads.length);
      }
    }
  }

  private findStrongestSquadIndex(squads: Squad[]): number {
    const temp = {};

    squads.forEach((squad, index) => {
      temp[index] = squad.getTotalHealthPoints();
    });

    const maxHealthPoints = Math.max(...(Object.values(temp) as number[]));

    return Object.entries(temp).findIndex(entry => entry[1] === maxHealthPoints);
  }

  private findWeakestSquadIndex(squads: Squad[]): number {
    const temp = {};

    squads.forEach((squad, index) => {
      temp[index] = squad.getTotalHealthPoints();
    });

    const minHealthPoints = Math.min(...(Object.values(temp) as number[]));

    return Object.entries(temp).findIndex(entry => entry[1] === minHealthPoints);
  }
}
