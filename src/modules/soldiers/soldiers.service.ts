import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { Soldier } from '../../entities/soldier.entity';
import { SoldierRepository } from './repositories/soldier.repository';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateSoldierDto } from './DTOs/createSoldier.dto';
import { User } from '../../entities/user.entity';
import { PolicyDto } from '../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { CreatePolicyDto } from '../access-control/DTOs/create-policy.dto';
import { SquadNotFoundError } from '../../errors/squad-not-found.error';
import { ConfigRepository } from '../configs/repositories/config.repository';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class SoldiersService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly configRepository: ConfigRepository,
    private readonly soldierRepository: SoldierRepository,
    private readonly configService: ConfigsService,
    private readonly accessControlService: AccessControlService,
    private readonly logger: LoggerService,
  ) {}

  public async getSoldier(soldierId: number): Promise<Soldier> {
    try {
      return this.soldierRepository.findOneOrFail(soldierId);
    } catch (error) {
      this.logger.error(
        {
          message: `Soldier not found. Error: ${error.message}`,
          soldierId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new Error('soldier not found');
    }
  }

  public async createSoldier(createSoldierDto: CreateSoldierDto, user: User): Promise<Soldier> {
    const { squadId } = createSoldierDto;

    const policy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.USERS,
      resourceOwnerId: user.id,
      resourceName: ResourceNameEnum.SQUADS,
      resourceId: squadId,
    };

    await this.accessControlService.checkAccessOrFail(policy);
    await this.configService.validateNumberOfUnitsPerSquadOrFail(squadId);

    let createdSoldier: Soldier;
    let savedSoldier: Soldier;

    try {
      const config = await this.configRepository.findActiveConfig();

      createdSoldier = this.soldierRepository.create({
        ...createSoldierDto,
        healthPoints: config.maxHealthPoints,
        squadId,
      });

      savedSoldier = await this.soldierRepository.save(createdSoldier);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not create soldier. Error: ${error}`,
          createSoldierDto,
          user,
        },
        error.stack,
        this.loggerContext,
      );
      // TODO create error
      throw new Error('could not create soldier');
    }

    const newPolicy: CreatePolicyDto = {
      resourceOwnerName: ResourceNameEnum.SQUADS,
      resourceOwnerId: squadId,
      resourceName: ResourceNameEnum.SOLDIERS,
      resourceId: savedSoldier.id,
    };

    await this.accessControlService.addAccessRuleToCreatedUnit(newPolicy);

    return savedSoldier;
  }

  public async deleteSoldier(soldierId: number): Promise<boolean> {
    let soldier: Soldier;
    try {
      soldier = await this.soldierRepository.findOneOrFail(soldierId);
    } catch (error) {
      this.logger.error(
        {
          message: `Soldier not found. Error: ${error.message}`,
          soldierId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new SquadNotFoundError(soldierId);
    }

    try {
      await this.soldierRepository.delete(soldierId);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not delete soldier. Error: ${error}`,
          soldierId,
        },
        error.stack,
        this.loggerContext,
      );
    }

    const newPolicy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.SQUADS,
      resourceOwnerId: soldier.squadId,
      resourceName: ResourceNameEnum.SOLDIERS,
      resourceId: soldier.id,
    };

    this.logger.debug(
      {
        message: `policy`,
        soldier,
      },
      this.loggerContext,
    );

    await this.accessControlService.removeAccessRuleOnDeletedUnit(newPolicy);

    return true;
  }
}
