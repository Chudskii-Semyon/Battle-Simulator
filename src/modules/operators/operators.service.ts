import { Injectable } from '@nestjs/common';
import { Operator } from '../../entities/operator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OperatorRepository } from './repositories/operator.repository';
import { LoggerService } from '../../logger/logger.service';
import { AccessControlService } from '../access-control/access-control.service';
import { User } from '../../entities/user.entity';
import { PolicyDto } from '../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { ForbiddenResourceError } from '../../errors/forbidden-resource.error';
import { CouldNotCreateSquadError } from '../../errors/could-not-create-squad.error';
import { CreatePolicyDto } from '../access-control/DTOs/create-policy.dto';
import { CreateOperatorDto } from './DTOs/create-operator.dto';
import { SquadNotFoundError } from '../../errors/squad-not-found.error';
import { Config } from '../../entities/config.entity';
import { ConfigRepository } from '../configs/repositories/config.repository';

@Injectable()
export class OperatorsService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: OperatorRepository,
    @InjectRepository(Config)
    private readonly configRepository: ConfigRepository,
    private readonly logger: LoggerService,
    private readonly accessControlService: AccessControlService,
  ) {}

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
      throw new SquadNotFoundError(operatorId);
    }
  }

  public async createOperator(createOperatorDto: CreateOperatorDto, user: User): Promise<Operator> {
    const { vehicleId } = createOperatorDto;

    const policy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.USERS,
      resourceOwnerId: user.id,
      resourceName: ResourceNameEnum.VEHICLES,
      resourceId: vehicleId,
    };
    const hasAccess = await this.accessControlService.checkAccessOrFail(policy);

    if (!hasAccess) {
      // TODO log error
      throw new ForbiddenResourceError();
    }

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
          user,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateSquadError();
    }

    const newPolicy: CreatePolicyDto = {
      resourceOwnerName: ResourceNameEnum.VEHICLES,
      resourceOwnerId: vehicleId,
      resourceName: ResourceNameEnum.OPERATORS,
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
      throw new SquadNotFoundError(operatorId);
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
      resourceOwnerName: ResourceNameEnum.VEHICLES,
      resourceOwnerId: operator.vehicleId,
      resourceName: ResourceNameEnum.OPERATORS,
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
