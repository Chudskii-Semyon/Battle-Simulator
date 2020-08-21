import { BATTLE_SIMULATION_QUEUE_TOKEN } from '../constants/queues.constant';
import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { AttackJob } from '../jobs/squad-attack.job';
import { CalculateBaseAttackSuccessVisitor } from '../visitors/calculate-base-attack-success.visitor';
import { CalculateBaseAttackDamageVisitor } from '../visitors/calculate-base-attack-damage.visitior';
import { InflictBaseDamageVisitor } from '../visitors/inflict-base-damage.visitor';
import { UnitLevelUpVisitor } from '../visitors/unit-level-up.visitor';
import { StrategyEnum } from '../../../enums/strategy.enum';
import { Squad } from '../composites/squad.composite';
import { CalculateRechargeTimeVisitor } from '../visitors/calculate-recharge-time.visitor';
import { Server } from 'socket.io';
import { Squads } from '../interfaces/squads.interface';
import { BATTLE_END } from '../constants/socket-events.constant';
import { GetHealthPointsVisitor } from '../visitors/get-health-points.visitior';
import { FilterInActiveUnitsVisitor } from '../visitors/filter-inactive-units.visitor';
import { LoggerService } from '../../../logger/logger.service';
import { ATTACK_JOB } from '../constants/jobs.constant';

@Processor(BATTLE_SIMULATION_QUEUE_TOKEN)
export class BattleSimulationProcessor {
  public socket: Server = null;
  private readonly loggerContext = this.constructor.name;
  private squads: Squads;

  constructor(
    @InjectQueue(BATTLE_SIMULATION_QUEUE_TOKEN)
    private readonly battleSimulationQueue: Queue,
    private readonly logger: LoggerService,
  ) {}

  @Process(ATTACK_JOB)
  public async attack(job: Job<AttackJob>): Promise<void> {
    const { attackerId, attackerSide } = job.data;

    const defenderSide = attackerSide === 'ally' ? 'enemy' : 'ally';

    const attacker = this.squads[attackerSide].find(squad => squad.id === attackerId);

    if (!attacker) {
      job.moveToFailed({ message: 'attacker with id: ' + attackerId + 'not found' });
      return;
    }

    const defenderIndex = this.selectSquadToAttack(attacker.strategy, defenderSide);
    const defenders = this.squads[defenderSide];
    const defender = defenders[defenderIndex];

    const calculateAttackSuccessVisitor = new CalculateBaseAttackSuccessVisitor();
    const defenderSuccess = calculateAttackSuccessVisitor.calculateAttackSuccess(defender);
    const attackerSuccess = calculateAttackSuccessVisitor.calculateAttackSuccess(attacker);

    this.logger.debug(
      {
        message: `Calculated attack success rates`,
        attackerSide,
        attackerSuccess,
        defenderSuccess,
      },
      this.loggerContext,
    );

    if (attackerSuccess > defenderSuccess) {
      const attackDamageVisitor = new CalculateBaseAttackDamageVisitor();
      const damage = attackDamageVisitor.calculateAttackDamage(defender);

      const inflictDamageVisitor = new InflictBaseDamageVisitor(damage);
      inflictDamageVisitor.inflictDamage(defender);

      const unitLevelUpVisitor = new UnitLevelUpVisitor();
      unitLevelUpVisitor.levelUp(attacker);
    }

    return;
  }

  @OnQueueCompleted({ name: ATTACK_JOB })
  public async onQueueCompleted(job: Job<AttackJob>): Promise<void> {
    const { attackerSide, attackerId } = job.data;

    this.filterSquads();

    if (this.checkWinner()) {
      await this.battleSimulationQueue.empty();
      this.socket.emit(BATTLE_END);
      return;
    }

    const attacker: Squad = this.squads[attackerSide].find(squad => squad.id === attackerId);

    const calculateRechargeTimeVisitor = new CalculateRechargeTimeVisitor();
    const attackRechargeTime = calculateRechargeTimeVisitor.calculateRechargeTime(attacker);

    await this.battleSimulationQueue.add(ATTACK_JOB, job.data, { delay: attackRechargeTime });
  }

  public setSquads(squads: Squads): void {
    this.squads = squads;
  }

  private selectSquadToAttack(strategy: StrategyEnum, side: string): number {
    switch (strategy) {
      case StrategyEnum.STRONGEST: {
        return this.findStrongestSquadIndex(side);
      }
      case StrategyEnum.WEAKEST: {
        return this.findWeakestSquadIndex(side);
      }
      default: {
        return Math.floor(Math.random() * this.squads[side].length);
      }
    }
  }

  private checkWinner(): boolean {
    const getHealthPointsVisitor = new GetHealthPointsVisitor();

    return Object.values(this.squads).some(squad => {
      return getHealthPointsVisitor.getTotalHealthPoints(...squad) <= 0;
    });
  }

  private filterSquads() {
    const filterUnitsVisitor = new FilterInActiveUnitsVisitor();

    const composedSquads = Object.values(this.squads);
    composedSquads.forEach(squad => filterUnitsVisitor.filterInActiveUnits(...squad));
  }

  private findStrongestSquadIndex(side: string): number {
    const squadHealthPointsForEachSquad = {};

    this.squads[side].forEach((squad, index) => {
      squadHealthPointsForEachSquad[index] = squad.getTotalHealthPoints();
    });

    const mappedSquadHealthPoints: number[] = Object.values(squadHealthPointsForEachSquad);
    const maxHealthPoints = Math.max(...mappedSquadHealthPoints);

    return Object.entries(squadHealthPointsForEachSquad).findIndex(
      entry => entry[1] === maxHealthPoints,
    );
  }

  private findWeakestSquadIndex(side: string): number {
    const squadHealthPointsForEachSquad = {};

    this.squads[side].forEach((squad, index) => {
      squadHealthPointsForEachSquad[index] = squad.getTotalHealthPoints();
    });

    const mappedSquadHealthPoints: number[] = Object.values(squadHealthPointsForEachSquad);
    const minHealthPoints = Math.min(...mappedSquadHealthPoints);

    return Object.entries(squadHealthPointsForEachSquad).findIndex(
      entry => entry[1] === minHealthPoints,
    );
  }
}
