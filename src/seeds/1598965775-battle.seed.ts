import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import { Army } from '../entities/army.entity';
import { Squad } from '../entities/squad.entity';
import { Soldier } from '../entities/soldier.entity';
import { randomRange } from '../utils/math.util';
import { Vehicle } from '../entities/vehicle.entity';
import { Operator } from '../entities/operator.entity';
import { ResourceNameEnum } from '../enums/resource-name.enum';
import { CreatePolicyDto } from '../modules/access-control/DTOs/create-policy.dto';
import { CasbinRules } from '../entities/casbin-rules.entity';
import { Config } from '../entities/config.entity';

const { USER, ARMY, SQUAD, SOLDIER, VEHICLE, OPERATOR } = ResourceNameEnum;

export class ArmiesTreeSeed1598965775 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepository = connection.getRepository(User);
    const armyRepository = connection.getRepository(Army);
    const squadRepository = connection.getRepository(Squad);
    const soldiersRepository = connection.getRepository(Soldier);
    const vehicleRepository = connection.getRepository(Vehicle);
    const operatorRepository = connection.getRepository(Operator);
    const casbinRuleRepository = connection.getRepository(CasbinRules);

    const config = await connection
      .getRepository(Config)
      .createQueryBuilder('config')
      .leftJoinAndSelect('config.active', 'configActive')
      .getOne();

    const users = await userRepository.find();

    for (const user of users) {
      const army = await factory(Army)().make({ user });

      await armyRepository.insert(army);
    }

    const createdArmies = await armyRepository.find();

    for (const army of createdArmies) {
      const casbinRules = this.buildCasbinRules({
        resourceOwnerName: USER,
        resourceOwnerId: army.userId,
        resourceName: ARMY,
        resourceId: army.id,
      });

      await casbinRuleRepository.insert(casbinRules);

      const numberOfSquads = randomRange(0, config.numberOfSquadsPerArmy + 1);
      const squads = await factory(Squad)().makeMany(numberOfSquads, { army });

      await squadRepository.insert(squads);
    }

    const createdSquads = await squadRepository.find();

    for (const squad of createdSquads) {
      const casbinRules = this.buildCasbinRules({
        resourceOwnerName: ARMY,
        resourceOwnerId: squad.armyId,
        resourceName: SQUAD,
        resourceId: squad.id,
      });

      await casbinRuleRepository.insert(casbinRules);

      const { numberOfUnitsPerSquad } = config;

      const numberOfSoldiers = randomRange(0, numberOfUnitsPerSquad + 1);
      const soldiers = await factory(Soldier)().makeMany(numberOfSoldiers, { squad });

      await soldiersRepository.insert(soldiers);

      const maxVehiclesLeftToCreate = (numberOfUnitsPerSquad - numberOfSoldiers) / 2;

      const numberOfVehicles = randomRange(0, maxVehiclesLeftToCreate);

      const vehicles = await factory(Vehicle)().makeMany(numberOfVehicles, { squad });

      await vehicleRepository.insert(vehicles);

      const maxOperatorsLeftToCreate = numberOfUnitsPerSquad - numberOfVehicles - numberOfSoldiers;
      let vehiclesLeft = numberOfVehicles;
      let emptySlotsLeft = maxOperatorsLeftToCreate;

      const createdVehicles = await vehicleRepository.find({ squad });

      for (const vehicle of createdVehicles) {
        const casbinRules = this.buildCasbinRules({
          resourceOwnerName: SQUAD,
          resourceOwnerId: vehicle.squadId,
          resourceName: VEHICLE,
          resourceId: vehicle.id,
        });

        await casbinRuleRepository.insert(casbinRules);

        const maxOperatorsLeftToCreateOnOneVehicle = this.calculateMaxOperatorsLeftToCreateOnOneVehicle(
          vehiclesLeft,
          emptySlotsLeft,
        );

        const numberOfOperatorsToCreate = randomRange(1, maxOperatorsLeftToCreateOnOneVehicle + 1);

        const operators = await factory(Operator)().makeMany(numberOfOperatorsToCreate, {
          vehicle,
        });

        await operatorRepository.insert(operators);

        emptySlotsLeft -= numberOfOperatorsToCreate;
        vehiclesLeft -= 1;
      }
    }

    const createdSoldiers = await soldiersRepository.find();

    for (const soldier of createdSoldiers) {
      const casbinRules = this.buildCasbinRules({
        resourceOwnerName: SQUAD,
        resourceOwnerId: soldier.squadId,
        resourceName: SOLDIER,
        resourceId: soldier.id,
      });

      await casbinRuleRepository.insert(casbinRules);
    }

    const createdOperators = await operatorRepository.find();

    for (const operator of createdOperators) {
      const casbinRules = this.buildCasbinRules({
        resourceOwnerName: VEHICLE,
        resourceOwnerId: operator.vehicleId,
        resourceName: OPERATOR,
        resourceId: operator.id,
      });

      await casbinRuleRepository.insert(casbinRules);
    }
  }

  private buildCasbinRules({
    resourceId,
    resourceName,
    resourceOwnerId,
    resourceOwnerName,
  }: CreatePolicyDto): Array<any> {
    return [
      {
        ptype: 'p',
        v0: `role:${resourceOwnerName}/${resourceOwnerId}`,
        v1: `resource:${resourceName}/${resourceId}`,
        v2: '(GET)|(POST)|(PUT)|(DELETE)',
      },
      {
        ptype: 'g',
        v0: `role:${resourceOwnerName}/${resourceOwnerId}`,
        v1: `role:${resourceName}/${resourceId}`,
      },
    ];
  }

  private calculateMaxOperatorsLeftToCreateOnOneVehicle(vehiclesLeft, emptySlotsLeft): number {
    if (emptySlotsLeft < vehiclesLeft) {
      throw new Error('empty slots not enough');
    }

    const result = Math.ceil(emptySlotsLeft / vehiclesLeft);

    return result > 3 ? 3 : result;
  }
}
