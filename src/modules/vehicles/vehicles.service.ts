import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from './repositories/vehicle.repository';
import { LoggerService } from '../../logger/logger.service';
import { CreateVehicleDto } from './DTOs/createVehicle.dto';
import { User } from '../../entities/user.entity';
import { PolicyDto } from '../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { AccessControlService } from '../access-control/access-control.service';
import { CreatePolicyDto } from '../access-control/DTOs/create-policy.dto';
import { SquadNotFoundError } from '../../errors/squad-not-found.error';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class VehiclesService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: VehicleRepository,
    private readonly configService: ConfigsService,
    private readonly accessControlService: AccessControlService,
    private readonly logger: LoggerService,
  ) {}

  public async getVehicle(vehicleId: number): Promise<Vehicle> {
    try {
      return this.vehicleRepository.findOneOrFail(vehicleId);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not find vehicle. Error: ${error.message}`,
          vehicleId,
        },
        error.stack,
        this.loggerContext,
      );

      throw new Error('Vehicle not found');
    }
  }

  public async createVehicle(createVehicleDto: CreateVehicleDto, user: User): Promise<Vehicle> {
    const { squadId } = createVehicleDto;

    const policy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.USERS,
      resourceOwnerId: user.id,
      resourceName: ResourceNameEnum.SQUADS,
      resourceId: squadId,
    };

    await this.accessControlService.checkAccessOrFail(policy);

    await this.configService.validateNumberOfUnitsPerSquadOrFail(squadId);

    let createdVehicle: Vehicle;
    let savedVehicle: Vehicle;

    try {
      createdVehicle = this.vehicleRepository.create({
        ...createVehicleDto,
        squad: { id: squadId },
      });

      savedVehicle = await this.vehicleRepository.save(createdVehicle);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not create vehicle. Error: ${error.message}`,
          vehicle: createdVehicle,
        },
        error.stack,
        this.loggerContext,
      );

      throw new Error('could not create vehicle');
    }

    const newPolicy: CreatePolicyDto = {
      resourceOwnerName: ResourceNameEnum.SQUADS,
      resourceOwnerId: squadId,
      resourceName: ResourceNameEnum.VEHICLES,
      resourceId: savedVehicle.id,
    };

    await this.accessControlService.addAccessRuleToCreatedUnit(newPolicy);

    return savedVehicle;
  }

  public async deleteVehicle(vehicleId: number): Promise<boolean> {
    let vehicle: Vehicle;
    try {
      vehicle = await this.vehicleRepository.findOneOrFail(vehicleId);
    } catch (error) {
      this.logger.error(
        {
          message: `Vehicle not found. Error: ${error.message}`,
          vehicleId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new SquadNotFoundError(vehicleId);
    }

    try {
      await this.vehicleRepository.delete(vehicleId);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not delete vehicle. Error: ${error}`,
          vehicleId,
        },
        error.stack,
        this.loggerContext,
      );
    }

    const newPolicy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.SQUADS,
      resourceOwnerId: vehicle.squadId,
      resourceName: ResourceNameEnum.VEHICLES,
      resourceId: vehicle.id,
    };

    this.logger.debug(
      {
        message: `policy`,
        vehicle,
      },
      this.loggerContext,
    );

    await this.accessControlService.removeAccessRuleOnDeletedUnit(newPolicy);

    return true;
  }
}
