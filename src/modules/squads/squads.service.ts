import { Injectable } from '@nestjs/common';
import { CreateSquadDto } from './DTOs/create-squad.dto';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SquadRepository } from './repositories/squad.repository';
import { Squad } from '../../entities/squad';
import { AccessControlService } from '../access-control/access-control.service';
import { User } from '../../entities/user.entity';
import { PolicyDto } from '../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { CouldNotCreateSquadError } from '../../errors/could-not-create-squad.error';
import { SquadNotFoundError } from '../../errors/squad-not-found.error';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class SquadsService {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @InjectRepository(Squad)
    private readonly squadRepository: SquadRepository,
    private readonly configService: ConfigsService,
    private readonly logger: LoggerService,
    private readonly accessControlService: AccessControlService,
  ) {}

  public async getSquad(squadId: number): Promise<Squad> {
    try {
      return this.squadRepository.findOneOrFail(squadId);
    } catch (error) {
      this.logger.error(
        {
          message: `Squad not found. Error: ${error.message}`,
          squadId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new SquadNotFoundError(squadId);
    }
  }

  public async createSquad(createSquadDto: CreateSquadDto, user: User): Promise<Squad> {
    const { armyId } = createSquadDto;

    const policy: PolicyDto = {
      resourceOwnerName: ResourceNameEnum.USERS,
      resourceOwnerId: user.id,
      resourceName: ResourceNameEnum.ARMIES,
      resourceId: armyId,
    };

    await this.accessControlService.checkAccessOrFail(policy);

    await this.configService.validateNumberOfSquadsPerArmyOrFail(armyId);

    let createdSquad: Squad;
    let savedSquad: Squad;

    try {
      createdSquad = this.squadRepository.create({
        ...createSquadDto,
        armyId,
      });
      savedSquad = await this.squadRepository.save(createdSquad);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not create squad. Error: ${error.message}`,
          createSquadDto,
          user,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateSquadError();
    }

    const newPolicy = this.buildPolicy(armyId, savedSquad.id);
    await this.accessControlService.addAccessRuleToCreatedUnit(newPolicy);

    return savedSquad;
  }

  public async deleteSquad(squadId: number): Promise<boolean> {
    let squad: Squad;
    try {
      squad = await this.squadRepository.findOneOrFail(squadId);
    } catch (error) {
      this.logger.error(
        {
          message: `Squad not found. Error: ${error.message}`,
          squadId,
        },
        error.stack,
        this.loggerContext,
      );
      throw new SquadNotFoundError(squadId);
    }

    try {
      await this.squadRepository.delete(squadId);
    } catch (error) {
      this.logger.error(
        {
          message: `Could not delete squad. Error: ${error}`,
          squadId,
        },
        error.stack,
        this.loggerContext,
      );
    }

    const newPolicy = this.buildPolicy(squad.armyId, squad.id);

    await this.accessControlService.removeAccessRuleOnDeletedUnit(newPolicy);

    return true;
  }

  private buildPolicy(ownerId: number, resourceId: number): PolicyDto {
    return {
      resourceOwnerName: ResourceNameEnum.ARMIES,
      resourceOwnerId: ownerId,
      resourceName: ResourceNameEnum.SQUADS,
      resourceId,
    };
  }
}
