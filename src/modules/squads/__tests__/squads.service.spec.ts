import { Test, TestingModule } from '@nestjs/testing';
import { SquadsService } from '../squads.service';
import { AccessControlModule } from '../../access-control/access-control.module';
import { SquadRepository } from '../repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { SquadsController } from '../squads.controller';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from '../../configs/configs.module';
import { CreateSquadDto } from '../DTOs/create-squad.dto';
import { AccessControlService } from '../../access-control/access-control.service';
import { ConfigsService } from '../../configs/configs.service';
import { PolicyDto } from '../../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { SquadNotFoundError } from '../../../errors/squad-not-found.error';
import { mockSquad, mockUser } from '../../../mocks/entities';
import {
  mockConfigRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';

describe('SquadsService', () => {
  let service: SquadsService;
  let accessControlService: AccessControlService;
  let configsService: ConfigsService;

  let addAccessRuleToCreatedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let checkAccessOrFailSpy: jest.SpyInstance<Promise<boolean>>;
  let validateNumberOfSquadsPerArmyOrFailSpy: jest.SpyInstance<Promise<boolean>>;
  let removeAccessRuleOnDeletedUnitSpy: jest.SpyInstance<Promise<boolean>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule, AccessControlModule, TypeOrmModule.forFeature([SquadRepository])],
      controllers: [SquadsController],
      providers: [SquadsService, LoggerService],
    })
      .overrideProvider(SquadRepository)
      .useValue(mockSquadRepository)
      .overrideProvider(ConfigRepository)
      .useValue(mockConfigRepository)
      .overrideProvider(SoldierRepository)
      .useValue(mockSoldierRepository)
      .overrideProvider(VehicleRepository)
      .useValue(mockVehicleRepository)
      .compile();

    accessControlService = module.get<AccessControlService>(AccessControlService);
    configsService = module.get<ConfigsService>(ConfigsService);
    service = module.get<SquadsService>(SquadsService);
  });

  beforeEach(() => {
    addAccessRuleToCreatedUnitSpy = jest
      .spyOn(accessControlService, 'addAccessRuleToCreatedUnit')
      .mockResolvedValue(true);
    checkAccessOrFailSpy = jest
      .spyOn(accessControlService, 'checkAccessOrFail')
      .mockResolvedValue(false);
    removeAccessRuleOnDeletedUnitSpy = jest.spyOn(
      accessControlService,
      'removeAccessRuleOnDeletedUnit',
    );

    validateNumberOfSquadsPerArmyOrFailSpy = jest
      .spyOn(configsService, 'validateNumberOfSquadsPerArmyOrFail')
      .mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSquad', function() {
    let createSquadDto: CreateSquadDto;

    beforeEach(() => {
      createSquadDto = {
        name: mockSquad.name,
        armyId: mockSquad.armyId,
        strategy: mockSquad.strategy,
      };
    });

    it('should check user access to army', async function() {
      await service.createSquad(createSquadDto, mockUser);

      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.USERS,
        resourceOwnerId: mockUser.id,
        resourceName: ResourceNameEnum.ARMIES,
        resourceId: createSquadDto.armyId,
      };

      expect(checkAccessOrFailSpy).toBeCalledWith(policy);
    });

    it('should validate number of squad before squad creation', async function() {
      await service.createSquad(createSquadDto, mockUser);

      expect(validateNumberOfSquadsPerArmyOrFailSpy).toBeCalledWith(createSquadDto.armyId);
    });

    it('should add access policy', async function() {
      await service.createSquad(createSquadDto, mockUser);

      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.ARMIES,
        resourceOwnerId: mockSquad.armyId,
        resourceName: ResourceNameEnum.SQUADS,
        resourceId: mockSquad.id,
      };

      expect(addAccessRuleToCreatedUnitSpy).toBeCalledWith(policy);
    });

    it('should create squad', async function() {
      const result = await service.createSquad(createSquadDto, mockUser);
      expect(result).toBe(mockSquad);
    });
  });

  describe('getSquad', function() {
    let squadId: number;
    beforeEach(() => {
      squadId = mockSquad.id;
    });

    it('should return squad', async function() {
      const result = await service.getSquad(squadId);

      expect(result).toBe(mockSquad);
    });

    it('should throw SquadNotFoundError when squad not found', async function() {
      mockSquadRepository.findOneOrFail.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await service.getSquad(squadId);

        fail('did not throw expected error');
      } catch (error) {
        expect(error).toStrictEqual(new SquadNotFoundError(squadId));
      }
    });
  });

  describe('deleteSquad', function() {
    let squadId: number;
    beforeEach(() => {
      squadId = mockSquad.id;
    });

    it('should throw SquadNotFoundError when squad not found', async function() {
      mockSquadRepository.findOneOrFail.mockImplementationOnce(() => {
        throw new Error('mock error');
      });

      try {
        await service.deleteSquad(squadId);

        fail('did not throw expected error');
      } catch (error) {
        expect(error).toStrictEqual(new SquadNotFoundError(squadId));
      }
    });

    it('should delete squad', async function() {
      await service.deleteSquad(squadId);

      expect(mockSquadRepository.delete).toBeCalledWith(squadId);
    });

    it('should remove access policy', async function() {
      await service.deleteSquad(squadId);

      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.ARMIES,
        resourceOwnerId: mockSquad.armyId,
        resourceName: ResourceNameEnum.SQUADS,
        resourceId: squadId,
      };

      expect(removeAccessRuleOnDeletedUnitSpy).toBeCalledWith(policy);
    });
  });
});
