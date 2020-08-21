import { Test, TestingModule } from '@nestjs/testing';
import { SoldiersService } from '../soldiers.service';
import { SoldierRepository } from '../repositories/soldier.repository';
import { ConfigsModule } from '../../configs/configs.module';
import { AccessControlModule } from '../../access-control/access-control.module';
import { SoldiersController } from '../soldiers.controller';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  mockConfigRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { SquadRepository } from '../../squads/repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { CreateSoldierDto } from '../DTOs/createSoldier.dto';
import { mockSoldier } from '../../../mocks/entities';
import { AccessControlService } from '../../access-control/access-control.service';
import { ConfigsService } from '../../configs/configs.service';
import { PolicyDto } from '../../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { SoldierNotFoundError } from '../../../errors/soldier-not-found.error';

describe('SoldiersService', () => {
  let service: SoldiersService;
  let accessControlService: AccessControlService;
  let configsService: ConfigsService;

  let addAccessRuleToCreatedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let removeAccessRuleOnDeletedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let validateNumberOfUnitsPerSquadOrFail: jest.SpyInstance<Promise<boolean>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([SoldierRepository]), ConfigsModule, AccessControlModule],
      controllers: [SoldiersController],
      providers: [SoldiersService, LoggerService],
    })
      .overrideProvider(SoldierRepository)
      .useValue(mockSoldierRepository)
      .overrideProvider(SquadRepository)
      .useValue(mockSquadRepository)
      .overrideProvider(ConfigRepository)
      .useValue(mockConfigRepository)
      .overrideProvider(VehicleRepository)
      .useValue(mockVehicleRepository)
      .compile();

    service = module.get<SoldiersService>(SoldiersService);
    accessControlService = module.get<AccessControlService>(AccessControlService);
    configsService = module.get<ConfigsService>(ConfigsService);
  });

  beforeEach(() => {
    addAccessRuleToCreatedUnitSpy = jest
      .spyOn(accessControlService, 'addAccessRuleToCreatedUnit')
      .mockResolvedValue(true);
    removeAccessRuleOnDeletedUnitSpy = jest.spyOn(
      accessControlService,
      'removeAccessRuleOnDeletedUnit',
    );

    validateNumberOfUnitsPerSquadOrFail = jest
      .spyOn(configsService, 'validateNumberOfUnitsPerSquadOrFail')
      .mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSoldier', function() {
    let createSoldierDto: CreateSoldierDto;
    beforeEach(() => {
      createSoldierDto = {
        squadId: mockSoldier.squadId,
      };
    });

    it('should validate number of soldiers per squad', async function() {
      await service.createSoldier(createSoldierDto);

      expect(validateNumberOfUnitsPerSquadOrFail).toBeCalledWith(createSoldierDto.squadId);
    });

    it('should create soldier', async function() {
      const result = await service.createSoldier(createSoldierDto);

      expect(result).toBe(mockSoldier);
    });

    it('should create new access policy', async function() {
      await service.createSoldier(createSoldierDto);

      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.SQUAD,
        resourceOwnerId: createSoldierDto.squadId,
        resourceName: ResourceNameEnum.SOLDIER,
        resourceId: mockSoldier.id,
      };

      expect(addAccessRuleToCreatedUnitSpy).toBeCalledWith(policy);
    });

    describe('getSoldier', function() {
      it('should return soldier', async function() {
        const result = await service.getSoldier(mockSoldier.id);

        expect(result).toBe(mockSoldier);
      });

      it('should throw soldier not found error if soldier is not found', async function() {
        mockSoldierRepository.findOneOrFail.mockImplementationOnce(() => {
          throw new Error('soldier not found');
        });

        try {
          await service.getSoldier(mockSoldier.id);
        } catch (error) {
          expect(error).toStrictEqual(new SoldierNotFoundError(mockSoldier.id));
        }
      });
    });

    describe('deleteSoldier', function() {
      const soldierId = mockSoldier.id;

      it('should delete soldier', async function() {
        await service.deleteSoldier(soldierId);

        expect(mockSoldierRepository.delete).toBeCalledWith(soldierId);
      });

      it('should throw soldier not found', async function() {
        mockSoldierRepository.findOneOrFail.mockImplementationOnce(() => {
          throw new Error();
        });

        try {
          await service.deleteSoldier(soldierId);
        } catch (error) {
          expect(error).toStrictEqual(new SoldierNotFoundError(soldierId));
        }
      });

      it('should remove access policy', async function() {
        const policy: PolicyDto = {
          resourceOwnerName: ResourceNameEnum.SQUAD,
          resourceOwnerId: mockSoldier.squadId,
          resourceName: ResourceNameEnum.SOLDIER,
          resourceId: soldierId,
        };

        await service.deleteSoldier(soldierId);

        expect(removeAccessRuleOnDeletedUnitSpy).toBeCalledWith(policy);
      });
    });
  });
});
