import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { Army } from '../../entities/army.entity';
import { ArmyRepository } from '../armies/repositories/army.repository';
import { User } from '../../entities/user.entity';
import { Squad } from './composites/squad.composite';
import { Server } from 'socket.io';
import { plainToClass } from 'class-transformer';
import { CreateUnitDto } from './DTOs/create-unit.dto';
import { Vehicle } from './composites/vehicle.composite';
import { Operator } from './composites/leafs/operator.leaf';
import { Soldier } from './composites/leafs/soldier.leaf';
import { InjectQueue } from '@nestjs/bull';
import { BATTLE_SIMULATION_QUEUE_TOKEN } from './constants/queues.constant';
import { Queue } from 'bull';
import { BattleSimulationProcessor } from './processors/battle-simulation.processor';
import { Squads } from './interfaces/squads.interface';
import { AttackJob } from './jobs/squad-attack.job';
import { ATTACK_JOB } from './constants/jobs.constant';

@Injectable()
export class BattleService {
  public socket: Server = null;

  constructor(
    @InjectQueue(BATTLE_SIMULATION_QUEUE_TOKEN)
    private readonly battleSimulationQueue: Queue,
    private readonly armyRepository: ArmyRepository,
    private readonly battleSimulatorProcessor: BattleSimulationProcessor,
    private readonly logger: LoggerService,
  ) {}

  public async battleStart(enemyArmyId: number, user: User): Promise<void> {
    const armies = await this.armyRepository.find({
      where: [{ id: enemyArmyId }, { userId: user.id }],
      relations: ['squads', 'squads.soldiers', 'squads.vehicles', 'squads.vehicles.operators'],
    });

    const squads: Squads = {
      ally: [],
      enemy: [],
    };

    armies.forEach(army => {
      if (army.userId === user.id) {
        squads['ally'] = [...this.buildComposedSquads(army)];
      } else {
        squads['enemy'] = [...this.buildComposedSquads(army)];
      }
    });

    this.battleSimulatorProcessor.setSquads(squads);

    Object.keys(squads).forEach(squadKey => {
      squads[squadKey].forEach(squad => {
        const attackJob: AttackJob = { attackerId: squad.id, attackerSide: squadKey };

        this.battleSimulationQueue.add(ATTACK_JOB, attackJob, { delay: 2000 });
      });
    });
  }

  private buildComposedSquads(army: Army): Squad[] {
    return army.squads.map(squad => {
      const squadUnit = new Squad(squad.id, squad.strategy);

      squad.vehicles.forEach(vehicle => {
        const createVehicleUnit = plainToClass(CreateUnitDto, vehicle);
        const vehicleUnit = new Vehicle(createVehicleUnit);

        vehicle.operators.forEach(operator => {
          const createOperatorUnit = plainToClass(CreateUnitDto, operator);
          const operatorUnit = new Operator(createOperatorUnit);

          vehicleUnit.addOperator(operatorUnit);
        });
        squadUnit.addUnit(vehicleUnit);
      });

      squad.soldiers.forEach(soldier => {
        const createSoldierUnit = plainToClass(CreateUnitDto, soldier);
        const soldierUnit = new Soldier(createSoldierUnit);

        squadUnit.addUnit(soldierUnit);
      });

      return squadUnit;
    });
  }
}
