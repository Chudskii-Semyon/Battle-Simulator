import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Vehicle } from '../../entities/vehicle.entity';
// import { Soldier } from '../../entities/soldier.entity';
// import { Operator } from '../../entities/operator.entity';
import { ArmyRepository } from '../armies/repositories/army.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Army } from '../../entities/army.entity';
import { LoggerService } from '../../logger/logger.service';
import { BattleService } from './battle.service';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { BATTLE_START } from './constants/socket-events.constant';

// import {Squad} from './composite'

@WebSocketGateway()
export class BattleGateway {
  @WebSocketServer()
  server: Server;
  private armies = {};

  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Army)
    private readonly armiesRepository: ArmyRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly battleService: BattleService,
    private socketService: BattleService,
  ) {}

  afterInit(server: Server) {
    this.battleService.socket = server;
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage(BATTLE_START)
  async battleStart(@MessageBody() data: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail(3);

    await this.battleService.battleStart(21, user);
    // const armies = await this.armiesRepository.find({
    //   where: { id: In([19, 21]) },
    //   relations: ['squads', 'squads.soldiers', 'squads.vehicles', 'squads.vehicles.operators'],
    // });

    // const squads: Squad[] = [];

    // armies.forEach(army => {
    //   army.squads.forEach(squad => {
    //     const squadUnit = new Squad();
    //     squad.vehicles.forEach(vehicle => {
    //       const { healthPoints, operators, recharge } = vehicle;
    //       const composedVehicle = new Vehicle(healthPoints, recharge);
    //       operators.forEach(operator => {
    //         const { healthPoints, recharge } = operator;
    //         const operatorUnit = new Soldier(healthPoints, recharge);
    //
    //         composedVehicle.addOperator(operatorUnit);
    //       });
    //       squadUnit.addUnit(composedVehicle);
    //     });
    //     squad.soldiers.forEach(soldier => {
    //       const { healthPoints, recharge } = soldier;
    //       const soldierUnit = new Soldier(healthPoints, recharge);
    //
    //       squadUnit.addUnit(soldierUnit);
    //     });
    //     squads.push(squadUnit);
    //   });
    // });

    // squads.forEach(squad => console.log('TOTAL HP =>', squad.getTotalHealthPoints()));

    // const calculateAttackSuccess = new CalculateBaseAttackSuccessVisitor();

    // const result = calculateAttackSuccess.calculateAttackSuccess(squads);

    // const calculateAttackDamage = new CalculateBaseAttackDamageVisitor();

    // const inflictDamageVisitor = new InflictBaseDamageVisitor(
    //   calculateAttackDamage.calculateAttackDamage(squads) / squads.length,
    // );

    // inflictDamageVisitor.inflictDamage(squads);
    // this.logger.error(
    //   {
    //     message: `RESULT`,
    //     result: result || 0,
    //   },
    // error.stack,
    // this.loggerContext,
    // );

    // squads.forEach(squad => console.log('TOTAL HP =>', squad.getTotalHealthPoints()));

    // this.logger.debug(
    //   {
    //     message: `squads`,
    //     l1: armies[0].squads.length,
    //     l2: armies[1].squads.length,
    //   },
    //   this.loggerContext,
    // );

    // armies.forEach(army => (this.armies[army.id] = army));

    // Object.values(this.armies).forEach((army: Army) => {
    //   army.squads.forEach(squad => this.squadAttack(squad));
    // });

    // this.userSquads.forEach(squad => this.squadAttack(squad));

    // const squadAttackDto: SquadAttackDto = {
    //   attackSquad: armies[0].squads[0],
    //   defendSquad: armies[1].squads[0],
    // };
    // const attacker = armies[0].squads[0];
    // const defenders = armies[1].squads;

    // this.squadAttack(attacker, defenders);
    // const inter = reInterval(function() {
    //   console.log('this should be called after 13s');
    // }, 10 * 1000);

    // reInterval(() => this.squadAttack(squadAttackDto), 3 * 1000);

    // console.log(this.recursiveFunc(1));
    // this.server.emit('result', { hello: 'hello' });
    // setInterval(() => this.server.emit('result', { hello: 'hello' }), 5000);
    // return data;
  }

  // public recursiveFunc(value: number): string {
  //   if (value >= 5) {
  //     return 'end';
  //   }
  //   this.server.emit('result', { value });
  //   value++;
  //   setTimeout(() => this.recursiveFunc(value), 5000);
  // }

  // private calculateSquadSuccessRate = (squad: SquadEntity): number => {
  //   const vehicleSuccessRates = squad.vehicles.map(vehicle =>
  //     this.calculateVehicleSuccessRate(vehicle),
  //   );
  //   const soldierSuccessRates = squad.soldiers.map(this.calculateSoldierSuccessRate);
  //   return this.geometricMean(vehicleSuccessRates.concat(soldierSuccessRates));
  // };
  //
  // private isSquadInActive({ vehicles, soldiers }: SquadEntity): boolean {
  //   return !vehicles.length && !soldiers.length;
  // }
  //
  // private selectSquadToAttack(strategy: StrategyEnum, squads: SquadEntity[]): number {
  //   switch (strategy) {
  //     case StrategyEnum.STRONGEST: {
  //       return this.findStrongestSquadIndex(squads);
  //     }
  //     case StrategyEnum.WEAKEST: {
  //       return this.findWeakestSquadIndex(squads);
  //     }
  //     default: {
  //       return Math.floor(Math.random() * squads.length);
  //     }
  //   }
  // }
  //
  // private getTotalHealthPointsOfSquadUnits(squad: SquadEntity): number {
  //   const soldiersHealthPoints = sumBy(squad.soldiers, soldier => soldier.health_points);
  //
  //   let vehiclesHealthPoints = 0;
  //   let operatorsHealthPoints = 0;
  //
  //   squad.vehicles.forEach(vehicle => {
  //     operatorsHealthPoints += sumBy(vehicle.operators, operator => operator.health_points);
  //     vehiclesHealthPoints += vehicle.healthPoints;
  //   });
  //
  //   return soldiersHealthPoints + vehiclesHealthPoints + operatorsHealthPoints;
  // }
  //
  // private findStrongestSquadIndex(squads: SquadEntity[]): number {
  //   const totalHealthPointsOfSquads = {};
  //
  //   squads.forEach((squad, index) => {
  //     const totalHealthPoints = this.getTotalHealthPointsOfSquadUnits(squad);
  //     totalHealthPointsOfSquads[totalHealthPoints] = index;
  //   });
  //
  //   const minHealthPoints = max(Object.values(totalHealthPointsOfSquads));
  //   return totalHealthPointsOfSquads[minHealthPoints];
  // }
  //
  // private findWeakestSquadIndex(squads: SquadEntity[]): number {
  //   const totalHealthPointsOfSquads = {};
  //
  //   squads.forEach((squad, index) => {
  //     const soldiersHealthPoints = sumBy(squad.soldiers, soldier => soldier.health_points);
  //
  //     let vehiclesHealthPoints = 0;
  //     let operatorsHealthPoints = 0;
  //
  //     squad.vehicles.forEach(vehicle => {
  //       operatorsHealthPoints += sumBy(vehicle.operators, operator => operator.health_points);
  //       vehiclesHealthPoints += vehicle.healthPoints;
  //     });
  //
  //     totalHealthPointsOfSquads[
  //       soldiersHealthPoints + vehiclesHealthPoints + operatorsHealthPoints
  //     ] = index;
  //   });
  //
  //   const minHealthPoints = min(Object.values(totalHealthPointsOfSquads));
  //   return totalHealthPointsOfSquads[minHealthPoints];
  // }
  //
  // // private filterInActiveSquads(armyId: number): void {
  // //   return this.armies[armyId].squads.filter(squad => !this.isSquadInActive(squad));
  // // }
  //
  // private squadAttack = (attacker: SquadEntity): void => {
  //   if (this.isSquadInActive(attacker)) {
  //     return;
  //   }
  //
  //   const allyArmyId = attacker.armyId;
  //   const enemyArmyId = Object.keys(this.armies).find(armyId => +armyId !== allyArmyId);
  //
  //   if (!this.armies[allyArmyId].squads.length) {
  //     return;
  //   }
  //
  //   const enemySquads = this.armies[enemyArmyId].squads;
  //
  //   // this.logger.debug(
  //   //   {
  //   //     message: `'enemy squads`,
  //   //     length: enemySquads.length,
  //   //     allySquadsLength: this.armies[allyArmyId].squads.length,
  //   //     armyId: allyArmyId,
  //   //   },
  //   //   this.loggerContext,
  //   // );
  //
  //   if (!enemySquads.length) {
  //     return;
  //   }
  //
  //   const defendIndex = this.selectSquadToAttack(attacker.strategy, enemySquads);
  //
  //   const defender = enemySquads[defendIndex];
  //
  //   const attackerSuccessRate = this.calculateSquadSuccessRate(attacker);
  //   const defenderSuccessRate = this.calculateSquadSuccessRate(defender);
  //
  //   // this.logger.debug(
  //   //   {
  //   //     message: `SUCCESS RATES`,
  //   //     attackerName: attacker.name,
  //   //     defenderName: defender.name,
  //   //     attackerSuccessRate,
  //   //     defenderSuccessRate,
  //   //   },
  //   //   this.loggerContext,
  //   // );
  //
  //   if (attackerSuccessRate > defenderSuccessRate) {
  //     const attackerDamage = this.calculateSquadDamage(attacker);
  //     const avgSquadDamage = this.calculateDamagePerUnit(defender, attackerDamage);
  //
  //     this.server.emit('squadAttack', {
  //       squads: { attacker, defender },
  //       total: attackerDamage,
  //       avg: avgSquadDamage,
  //     });
  //
  //     const defenderAfterAttack = this.inflictDamageToSquad(defender, avgSquadDamage);
  //
  //     this.incrementSoldiersExperience(attacker);
  //
  //     const enemySquadsAfterAttack = enemySquads.map(_defender => {
  //       if (_defender.id === defenderAfterAttack.id) {
  //         _defender = { ...defenderAfterAttack };
  //       }
  //       return _defender;
  //     });
  //
  //     this.armies[enemyArmyId].squads = enemySquadsAfterAttack.filter(
  //       squad => !this.isSquadInActive(squad),
  //     );
  //
  //     if (!this.armies[enemyArmyId].squads.length) {
  //       this.server.emit('victory', { winner: this.armies[allyArmyId] });
  //       return;
  //     }
  //
  //     const attackerRechargeTime = this.getMaxRechargeTime(attacker);
  //
  //     setTimeout(() => this.squadAttack(attacker), attackerRechargeTime);
  //   } else {
  //     const attackerRechargeTime = this.getMaxRechargeTime(attacker);
  //     this.server.emit('attackFailed', { attacker, defender });
  //     setTimeout(() => this.squadAttack(attacker), attackerRechargeTime);
  //   }
  // };
  //
  // // private updateRecharge(squad: Squad)
  //
  // private incrementSoldiersExperience(squad: SquadEntity): void {
  //   squad.soldiers.forEach(soldier => {
  //     if (soldier.experience < 50) {
  //       soldier.experience += 1;
  //       soldier.recharge -= 40;
  //     }
  //   });
  //
  //   squad.vehicles.forEach(vehicle => {
  //     vehicle.operators.forEach(operator => {
  //       if (operator.experience < 50) {
  //         operator.experience += 1;
  //         operator.recharge -= 40;
  //       }
  //     });
  //
  //     vehicle.recharge -= 40;
  //   });
  // }
  //
  // private calculateSoldierSuccessRate = ({
  //   health_points,
  //   experience,
  // }: Soldier | Operator): number => {
  //   return (0.5 * (1 + health_points / 100) * this.randomRange(50 + experience, 100)) / 100;
  // };
  //
  // private calculateVehicleSuccessRate = ({ operators, healthPoints }: Vehicle): number => {
  //   const operatorsAttackSuccessRate = operators.map(this.calculateSoldierSuccessRate);
  //
  //   return 0.5 * (1 + healthPoints / 100) * this.geometricMean(operatorsAttackSuccessRate);
  // };
  //
  // private randomRange = (min: number, max: number): number =>
  //   min + Math.floor((max - min) * Math.random());
  //
  // private calculateSquadDamage = ({ vehicles, soldiers }: SquadEntity): number => {
  //   const totalVehiclesDamage = sum(vehicles.map(this.calculateVehicleDamage));
  //   const totalSoldiersDamage = sum(soldiers.map(this.calculateSoldierDamage));
  //
  //   return totalVehiclesDamage + totalSoldiersDamage;
  // };
  //
  // private calculateSoldierDamage = ({ experience, health_points }: Soldier): number =>
  //   (0.5 * ((1 + health_points / 100) * this.randomRange(50 + experience, 100))) / 100;
  //
  // private calculateVehicleDamage = ({ operators }: Vehicle): number => {
  //   const operatorsExperience = sumBy(operators, ({ experience }) => experience / 100);
  //
  //   return 0.1 + operatorsExperience;
  // };
  //
  // private getNumberOfSquadUnits = ({ vehicles, soldiers }: SquadEntity): number =>
  //   vehicles.length + soldiers.length;
  //
  // private calculateDamagePerUnit = (squad: SquadEntity, damage: number): number =>
  //   damage / this.getNumberOfSquadUnits(squad);
  //
  // private inflictDamageToVehicle(vehicle: Vehicle, damage: number): Vehicle {
  //   const updatedVehicle = { ...vehicle } as Vehicle;
  //   const damageToVehicle = (damage / 100) * 60;
  //
  //   // this.logger.debug(
  //   //   {
  //   //     message: `'DAMAGE TO VEHICLE`,
  //   //     damageToVehicle,
  //   //   },
  //   //   this.loggerContext,
  //   // );
  //
  //   const randomOperatorIndex = Math.floor(Math.random() * vehicle.operators.length);
  //
  //   updatedVehicle.operators = vehicle.operators.map((operator, index) => {
  //     if (index == randomOperatorIndex) {
  //       this.inflictDamageToSoldier(operator, (damage / 100) * 20);
  //     } else {
  //       this.inflictDamageToSoldier(operator, (damage / 100) * 10);
  //     }
  //
  //     return operator;
  //   });
  //
  //   updatedVehicle.health_points = vehicle.health_points - damageToVehicle;
  //
  //   this.server.emit('damageToUnit', {
  //     type: 'vehicle',
  //     id: vehicle.id,
  //     hp: vehicle.health_points - damage,
  //     damage,
  //   });
  //
  //   return updatedVehicle;
  // }
  //
  // private inflictDamageToSoldier = (
  //   unit: Soldier | Operator,
  //   damage: number,
  // ): Soldier | Operator => {
  //   this.server.emit('damageToUnit', {
  //     type: 'soldier',
  //     id: unit.id,
  //     hp: unit.health_points - damage,
  //     damage,
  //   });
  //   unit.health_points -= damage;
  //
  //   return unit;
  // };
  //
  // private filterUnActiveVehicles = (vehicles: Vehicle[]): Vehicle[] => {
  //   return vehicles.filter(vehicle => this.vehicleIsActive(vehicle));
  // };
  //
  // private soldierIsActive = (soldier: Soldier): boolean => {
  //   if (!(soldier.health_points > 0)) {
  //     this.server.emit('unitDied', { type: 'soldier', name: soldier.id });
  //     return false;
  //   }
  //   return true;
  // };
  //
  // private filterUnActiveSoldiers = (soldiers: Soldier[]): Soldier[] => {
  //   return soldiers.filter(soldier => this.soldierIsActive(soldier));
  // };
  //
  // private inflictDamageToSquad = (squad: SquadEntity, damagePerUnit: number): SquadEntity => {
  //   const updatedSquad = { ...squad } as SquadEntity;
  //   updatedSquad.vehicles = squad.vehicles.map(vehicle =>
  //     this.inflictDamageToVehicle(vehicle, damagePerUnit),
  //   );
  //   //
  //   // this.logger.debug(
  //   //   {
  //   //     message: `UPDATED VEHICLES`,
  //   //     vehicles: updatedSquad.vehicles,
  //   //     length: updatedSquad.soldiers.length,
  //   //   },
  //   //   this.loggerContext,
  //   // );
  //
  //   updatedSquad.soldiers = squad.soldiers.map(soldier =>
  //     this.inflictDamageToSoldier(soldier, damagePerUnit),
  //   ) as Soldier[];
  //
  //   updatedSquad.vehicles = this.filterUnActiveVehicles(updatedSquad.vehicles);
  //   updatedSquad.soldiers = this.filterUnActiveSoldiers(updatedSquad.soldiers);
  //
  //   // this.logger.debug(
  //   //   {
  //   //     message: `FILTERED S`,
  //   //     length: updatedSquad.soldiers.length,
  //   //   },
  //   //   this.loggerContext,
  //   // );
  //
  //   return updatedSquad;
  // };
  //
  // private vehicleIsActive(vehicle: Vehicle): boolean {
  //   const hasActiveOperator = vehicle.operators.some(operator => operator.health_points > 0);
  //   const hasHealthPoints = vehicle.health_points > 0;
  //
  //   // this.logger.debug(
  //   //   {
  //   //     message: `vehicle hp`,
  //   //     hp: vehicle.health_points,
  //   //     // hasActiveOperator,
  //   //     // hasHealthPoints,
  //   //   },
  //   //   this.loggerContext,
  //   // );
  //
  //   if (!hasActiveOperator || !hasHealthPoints) {
  //     this.server.emit('unitDied', { type: 'vehicle', name: vehicle.id });
  //     return false;
  //   }
  //
  //   return true;
  // }
  //
  // private getMaxRechargeTime({ vehicles, soldiers }: SquadEntity): number {
  //   const maxVehicleRechargeTime = Math.max(...vehicles.map(vehicle => vehicle.recharge));
  //   const maxSoldierRechargeTime = Math.max(...soldiers.map(soldier => soldier.recharge));
  //
  //   return Math.max(maxSoldierRechargeTime, maxVehicleRechargeTime);
  // }
  //
  // // private getMaxUnitRechargeTime(units: object[]): number {
  // //   units.find();
  // //   return Math.min(...units.map(unit => unit.recharge));
  // // }
  //
  // private geometricMean(arr: number[]): number {
  //   if (!arr.length) {
  //     return 0;
  //   }
  //
  //   if (!Array.isArray(arr) || arr.length === 0) {
  //     throw new Error('Argument should be an array');
  //   }
  //
  //   // Validate array content to be non zero numbers
  //   let result = 0;
  //   arr.forEach(x => {
  //     if (typeof x !== 'number' || isNaN(x) || x <= 0) {
  //       throw new Error('Array should contain non-zero positive numbers');
  //     }
  //
  //     result += Math.log(x);
  //   });
  //
  //   // Return for single length array
  //   if (arr.length === 1) {
  //     return arr[0];
  //   }
  //
  //   // Calculate geometric mean
  //   result /= arr.length;
  //   result = Math.exp(result);
  //
  //   return result;
  // }
}
