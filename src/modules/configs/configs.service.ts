import { Injectable } from '@nestjs/common';
import { ConfigRepository } from './repositories/config.repository';
import { LoggerService } from '../../logger/logger.service';
import { SquadRepository } from '../squads/repositories/squad.repository';
import { MaxNumberOfSquadsHasBeenReachedError } from '../../errors/max-number-of-squads-has-been-reached.error';
import { VehicleRepository } from '../vehicles/repositories/vehicle.repository';
import { SoldierRepository } from '../soldiers/repositories/soldier.repository';
import { MaxUnitsPerSquadHasBeenReachedError } from '../../errors/maximum-units-per-squad-has-bean-reached.error';
import { OperatorRepository } from '../operators/repositories/operator.repository';

@Injectable()
export class ConfigsService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly configRepository: ConfigRepository,
    private readonly squadRepository: SquadRepository,
    private readonly soldierRepository: SoldierRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly logger: LoggerService,
  ) {}

  public async validateNumberOfUnitsPerSquadOrFail(squadId: number): Promise<boolean> {
    this.logger.debug(
      {
        message: `Start validation of number of units per squad`,
        squadId,
      },
      this.loggerContext,
    );

    const squadVehicles = await this.vehicleRepository.find({ squadId });
    const squadVehiclesIds = squadVehicles.map(vehicle => vehicle.id);

    const numberOfVehicles = await this.vehicleRepository.countVehiclesBySquadId(squadId);
    const numberOfSoldiers = await this.soldierRepository.countSoldiersBySquadId(squadId);

    let numberOfOperators = 0;
    if (squadVehiclesIds.length) {
      numberOfOperators = await this.operatorRepository.countOperatorsByVehicleIds(
        ...squadVehiclesIds,
      );
    }

    const config = await this.configRepository.findActiveConfig();

    const numberOfUnitsPerSquad = numberOfSoldiers + numberOfVehicles + numberOfOperators;

    if (numberOfUnitsPerSquad >= config.numberOfUnitsPerSquad) {
      this.logger.error(
        {
          message: `Maximum number of units per squad has been reached.`,
          numberOfVehicles,
          numberOfSoldiers,
          numberOfUnitsPerSquad,
          config: config.numberOfUnitsPerSquad,
        },
        new Error().stack,
        this.loggerContext,
      );

      throw new MaxUnitsPerSquadHasBeenReachedError();
    }

    return true;
  }

  public async validateNumberOfSquadsPerArmyOrFail(armyId: number): Promise<boolean> {
    this.logger.debug(
      {
        message: `start validating number of squads per army`,
        armyId,
      },
      this.loggerContext,
    );
    const userNumberOfSquads = await this.squadRepository.countSquadsByArmyId(armyId);
    const config = await this.configRepository.findActiveConfig();

    this.logger.debug(
      {
        message: `Got config and user's number of squads from database`,
        config,
      },
      this.loggerContext,
    );

    if (config.numberOfSquadsPerArmy <= userNumberOfSquads) {
      this.logger.error(
        {
          message: `Maximum number of squads per army has been reached`,
          userNumberOfSquads,
          configNumberOfSquads: config.numberOfSquadsPerArmy,
        },
        new Error().stack,
        this.loggerContext,
      );
      throw new MaxNumberOfSquadsHasBeenReachedError();
    }

    return true;
  }
}
