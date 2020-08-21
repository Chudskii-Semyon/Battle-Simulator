import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from './repositories/vehicle.repository';
import { LoggerService } from '../../logger/logger.service';
import { CreateVehicleDto } from './DTOs/createVehicle.dto';
import { PolicyDto } from '../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { AccessControlService } from '../access-control/access-control.service';
import { CreatePolicyDto } from '../access-control/DTOs/create-policy.dto';
import { ConfigsService } from '../configs/configs.service';
import { VehicleNotFoundError } from '../../errors/vehicle-not-found.error';

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

  public async getVehicles(squadId: number): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({ squadId });
  }

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

      throw new VehicleNotFoundError(vehicleId);
    }
  }

  public async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { squadId } = createVehicleDto;

    await this.configService.validateNumberOfUnitsPerSquadOrFail(squadId);

    let createdVehicle: Vehicle;
    let savedVehicle: Vehicle;

    try {
      createdVehicle = this.vehicleRepository.create({
        ...createVehicleDto,
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
      resourceOwnerName: ResourceNameEnum.SQUAD,
      resourceOwnerId: savedVehicle.squadId,
      resourceName: ResourceNameEnum.VEHICLE,
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
      throw new VehicleNotFoundError(vehicleId);
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
      resourceOwnerName: ResourceNameEnum.SQUAD,
      resourceOwnerId: vehicle.squadId,
      resourceName: ResourceNameEnum.VEHICLE,
      resourceId: vehicle.id,
    };

    await this.accessControlService.removeAccessRuleOnDeletedUnit(newPolicy);

    return true;
  }
}
