import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from '../../entities/config.entity';
import { ConfigRepository } from './repositories/config.repository';
import { LoggerService } from '../../logger/logger.service';
import { Squad } from '../../entities/squad';
import { SquadRepository } from '../squads/repositories/squad.repository';
import { MaxNumberOfSquadsHasBeenReachedError } from '../../errors/max-number-of-squads-has-been-reached.error';
import { Vehicle } from '../../entities/vehicle.entity';
import { VehicleRepository } from '../vehicles/repositories/vehicle.repository';
import { SoldierRepository } from '../soldiers/repositories/soldier.repository';
import { Soldier } from '../../entities/soldier.entity';
import { MaxUnitsPerSquadHasBeenReachedError } from '../../errors/maximum-units-per-squad-has-bean-reached.error';

@Injectable()
export class ConfigsService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @InjectRepository(Config)
    private readonly configRepository: ConfigRepository,
    @InjectRepository(Squad)
    private readonly squadRepository: SquadRepository,
    @InjectRepository(Soldier)
    private readonly soldierRepository: SoldierRepository,
    @InjectRepository(Vehicle)
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

    const numberOfVehicles = await this.vehicleRepository.countVehiclesBySquadId(squadId);
    const numberOfSoldiers = await this.soldierRepository.countSoldiersByArmyId(squadId);
    const config = await this.configRepository.findActiveConfig();

    const numberOfUnitsPerSquad = numberOfSoldiers + numberOfVehicles;

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
