import { Injectable } from '@nestjs/common';
import { Operator } from '../../entities/operator.entity';
import { OperatorRepository } from './repositories/operator.repository';
import { LoggerService } from '../../logger/logger.service';
import { AccessControlService } from '../access-control/access-control.service';
import { PolicyDto } from '../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { CreatePolicyDto } from '../access-control/DTOs/create-policy.dto';
import { CreateOperatorDto } from './DTOs/create-operator.dto';
import { ConfigRepository } from '../configs/repositories/config.repository';
import { ConfigsService } from '../configs/configs.service';
import { VehicleRepository } from '../vehicles/repositories/vehicle.repository';
import { VehicleNotFoundError } from '../../errors/vehicle-not-found.error';
import { Vehicle } from '../../entities/vehicle.entity';
import { OperatorNotFoundError } from '../../errors/operator-not-found.error';
import { CouldNotCreateOperatorError } from '../../errors/could-not-create-operator.error';

@Injectable()
export class OperatorsService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly operatorRepository: OperatorRepository,
    private readonly configRepository: ConfigRepository,
    private readonly configService: ConfigsService,
    private readonly logger: LoggerService,
    private readonly accessControlService: AccessControlService,
  ) {}

  public async getOperators(vehicleId: number): Promise<Operator[]> {
    return await this.operatorRepository.find({ vehicleId });
  }

  public async getOperator(operatorId: number): Promise<Operator> {
    try {
      return this.operatorRepository.findOneOrFail(operatorId);
    } catch (error) {
      this.logger.error(
        {
          message: `Operator not found. Error: ${error.message}`,
          operatorId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new OperatorNotFoundError(operatorId);
    }
  }

  public async createOperator(createOperatorDto: CreateOperatorDto): Promise<Operator> {
    const { vehicleId } = createOperatorDto;

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

    await this.configService.validateNumberOfUnitsPerSquadOrFail(vehicle.squadId);

    let createdOperator: Operator;
    let savedOperator: Operator;

    try {
      const { maxHealthPoints } = await this.configRepository.findActiveConfig();

      createdOperator = this.operatorRepository.create({
        ...createOperatorDto,
        healthPoints: maxHealthPoints,
        vehicleId,
      });
      savedOperator = await this.operatorRepository.save(createdOperator);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not create operator. Error: ${error.message}`,
          createOperatorDto,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateOperatorError();
    }

    const newPolicy: CreatePolicyDto = {
      resourceOwnerName: ResourceNameEnum.VEHICLE,
      resourceOwnerId: vehicleId,
      resourceName: ResourceNameEnum.OPERATOR,
      resourceId: savedOperator.id,
    };

    await this.accessControlService.addAccessRuleToCreatedUnit(newPolicy);

    return savedOperator;
  }

  public async deleteOperator(operatorId: number): Promise<boolean> {
    let operator: Operator;
    try {
      operator = await this.operatorRepository.findOneOrFail(operatorId);
    } catch (error) {
      this.logger.error(
        {
          message: `Operator not found. Error: ${error.message}`,
          operatorId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new OperatorNotFoundError(operatorId);
    }

    try {
      await this.operatorRepository.delete(operatorId);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not delete operator. Error: ${error}`,
          operatorId,
        },
        error.stack,
        this.loggerContext,
      );
    }

    const newPolicy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.VEHICLE,
      resourceOwnerId: operator.vehicleId,
      resourceName: ResourceNameEnum.OPERATOR,
      resourceId: operator.id,
    };

    this.logger.debug(
      {
        message: `policy`,
        operator,
      },
      this.loggerContext,
    );

    await this.accessControlService.removeAccessRuleOnDeletedUnit(newPolicy);

    return true;
  }
}
