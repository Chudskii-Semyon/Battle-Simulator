import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ArmyRepository } from './repositories/army.repository';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateArmyDto } from './DTOs/create-army.dto';
import { Army } from '../../entities/army.entity';
import { User } from '../../entities/user.entity';
import { CouldNotCreateArmyError } from '../../errors/could-not-create-army.error';
import { ArmyNotFoundError } from '../../errors/army-not-found.error';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { PolicyDto } from '../access-control/DTOs/policy.dto';

@Injectable()
export class ArmiesService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    private readonly armyRepository: ArmyRepository,
    private readonly accessControlService: AccessControlService,
  ) {}

  public async getArmy(armyId: number): Promise<Army> {
    try {
      return await this.armyRepository.findOneOrFail(armyId);
    } catch (error) {
      this.logger.error(
        {
          message: `Army not found. Error: ${error.message}`,
          armyId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new ArmyNotFoundError(armyId);
    }
  }

  public async createArmy(createArmyDto: CreateArmyDto, user: User): Promise<Army> {
    let newArmy: Army;
    let savedArmy: Army;
    try {
      newArmy = this.armyRepository.create({ ...createArmyDto, user, squads: [] });

      savedArmy = await this.armyRepository.save(newArmy);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not save army in database. Error: ${error.message}`,
          newArmy,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateArmyError();
    }

    const newPolicy = this.buildPolicy(user.id, savedArmy.id);

    await this.accessControlService.addAccessRuleToCreatedUnit(newPolicy);

    return savedArmy;
  }

  public async deleteArmy(armyId: number, user: User): Promise<boolean> {
    try {
      await this.armyRepository.delete(armyId);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not delete army. Error: ${error.message}`,
          armyId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new ArmyNotFoundError(armyId);
    }

    const newPolicy = this.buildPolicy(user.id, armyId);

    this.logger.debug(
      {
        message: `Built policy for deletion`,
        policyForDeletion: newPolicy,
      },
      this.loggerContext,
    );

    await this.accessControlService.removeAccessRuleOnDeletedUnit(newPolicy);

    return true;
  }

  private buildPolicy(ownerId: number, resourceId: number): PolicyDto {
    return {
      resourceOwnerName: ResourceNameEnum.USERS,
      resourceOwnerId: ownerId,
      resourceName: ResourceNameEnum.ARMIES,
      resourceId,
    };
  }
}
