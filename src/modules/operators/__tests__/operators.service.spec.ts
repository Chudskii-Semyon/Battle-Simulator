import { Test, TestingModule } from '@nestjs/testing';
import { OperatorsService } from '../operators.service';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorRepository } from '../repositories/operator.repository';
import { AccessControlModule } from '../../access-control/access-control.module';
import { ConfigsModule } from '../../configs/configs.module';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import {
  mockConfigRepository,
  mockOperatorRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { SquadRepository } from '../../squads/repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { AccessControlService } from '../../access-control/access-control.service';
import { ConfigsService } from '../../configs/configs.service';
import { mockOperator } from '../../../mocks/entities';
import { PolicyDto } from '../../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { OperatorNotFoundError } from '../../../errors/operator-not-found.error';
import { CreateOperatorDto } from '../DTOs/create-operator.dto';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';

describe('OperatorsService', () => {
  let service: OperatorsService;
  let accessControlService: AccessControlService;
  let configsService: ConfigsService;

  let addAccessRuleToCreatedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let removeAccessRuleOnDeletedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let validateNumberOfUnitsPerSquadOrFail: jest.SpyInstance<Promise<boolean>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([OperatorRepository]), AccessControlModule, ConfigsModule],
      providers: [OperatorsService, LoggerService],
    })
      .overrideProvider(VehicleRepository)
      .useValue(mockVehicleRepository)
      .overrideProvider(OperatorRepository)
      .useValue(mockOperatorRepository)
      .overrideProvider(SoldierRepository)
      .useValue(mockSoldierRepository)
      .overrideProvider(SquadRepository)
      .useValue(mockSquadRepository)
      .overrideProvider(ConfigRepository)
      .useValue(mockConfigRepository)
      .overrideProvider(OperatorRepository)
      .useValue(mockOperatorRepository)
      .compile();

    service = module.get<OperatorsService>(OperatorsService);
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

  describe('createOperator', function() {
    let createOperatorDto: CreateOperatorDto;

    beforeEach(() => {
      createOperatorDto = {
        vehicleId: mockOperator.vehicleId,
      };
    });

    it('should validate number of units per squad', async function() {
      await service.createOperator(createOperatorDto);

      expect(validateNumberOfUnitsPerSquadOrFail).toBeCalledWith(createOperatorDto.vehicleId);
    });

    it('should create operator', async function() {
      const result = await service.createOperator(createOperatorDto);

      expect(result).toBe(mockOperator);
    });

    it('should create new access policy', async function() {
      await service.createOperator(createOperatorDto);

      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.VEHICLE,
        resourceOwnerId: createOperatorDto.vehicleId,
        resourceName: ResourceNameEnum.OPERATOR,
        resourceId: mockOperator.id,
      };

      expect(addAccessRuleToCreatedUnitSpy).toBeCalledWith(policy);
    });
  });

  describe('getOperator', function() {
    it('should return operator', async function() {
      const result = await service.getOperator(mockOperator.id);

      expect(result).toBe(mockOperator);
    });

    it('should throw operator not found error if operator is not found', async function() {
      mockOperatorRepository.findOneOrFail.mockImplementationOnce(() => {
        throw new Error('operator not found');
      });

      try {
        await service.getOperator(mockOperator.id);
      } catch (error) {
        expect(error).toStrictEqual(new OperatorNotFoundError(mockOperator.id));
      }
    });
  });

  describe('deleteOperator', function() {
    const operatorId = mockOperator.id;

    it('should delete operator', async function() {
      await service.deleteOperator(operatorId);

      expect(mockOperatorRepository.delete).toBeCalledWith(operatorId);
    });

    it('should throw operator not found', async function() {
      mockOperatorRepository.findOneOrFail.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await service.deleteOperator(operatorId);
      } catch (error) {
        expect(error).toStrictEqual(new OperatorNotFoundError(operatorId));
      }
    });

    it('should remove access policy', async function() {
      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.VEHICLE,
        resourceOwnerId: mockOperator.vehicleId,
        resourceName: ResourceNameEnum.OPERATOR,
        resourceId: operatorId,
      };

      await service.deleteOperator(operatorId);

      expect(removeAccessRuleOnDeletedUnitSpy).toBeCalledWith(policy);
    });
  });
});
