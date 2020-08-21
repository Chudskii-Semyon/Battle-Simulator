import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from '../vehicles.service';
import { LoggerService } from '../../../logger/logger.service';
import { AccessControlModule } from '../../access-control/access-control.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import {
  mockConfigRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { SquadRepository } from '../../squads/repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { ConfigsModule } from '../../configs/configs.module';
import { AccessControlService } from '../../access-control/access-control.service';
import { ConfigsService } from '../../configs/configs.service';
import { mockVehicle } from '../../../mocks/entities';
import { PolicyDto } from '../../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { CreateVehicleDto } from '../DTOs/createVehicle.dto';
import { VehicleNotFoundError } from '../../../errors/vehicle-not-found.error';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let accessControlService: AccessControlService;
  let configsService: ConfigsService;

  let addAccessRuleToCreatedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let removeAccessRuleOnDeletedUnitSpy: jest.SpyInstance<Promise<boolean>>;
  let validateNumberOfUnitsPerSquadOrFail: jest.SpyInstance<Promise<boolean>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccessControlModule, ConfigsModule, TypeOrmModule.forFeature([VehicleRepository])],
      providers: [VehiclesService, LoggerService],
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

    service = module.get<VehiclesService>(VehiclesService);
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

  describe('createVehicle', function() {
    let createVehicleDto: CreateVehicleDto;

    beforeEach(() => {
      createVehicleDto = {
        squadId: mockVehicle.squadId,
      };
    });

    it('should validate number of vehicles per squad', async function() {
      await service.createVehicle(createVehicleDto);

      expect(validateNumberOfUnitsPerSquadOrFail).toBeCalledWith(createVehicleDto.squadId);
    });

    it('should create vehicle', async function() {
      const result = await service.createVehicle(createVehicleDto);

      expect(result).toBe(mockVehicle);
    });

    it('should create new access policy', async function() {
      await service.createVehicle(createVehicleDto);

      const policy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.SQUAD,
        resourceOwnerId: createVehicleDto.squadId,
        resourceName: ResourceNameEnum.VEHICLE,
        resourceId: mockVehicle.id,
      };

      expect(addAccessRuleToCreatedUnitSpy).toBeCalledWith(policy);
    });

    describe('getVehicle', function() {
      it('should return vehicle', async function() {
        const result = await service.getVehicle(mockVehicle.id);

        expect(result).toBe(mockVehicle);
      });

      it('should throw vehicle not found error if vehicle is not found', async function() {
        mockVehicleRepository.findOneOrFail.mockImplementationOnce(() => {
          throw new Error('vehicle not found');
        });

        try {
          await service.getVehicle(mockVehicle.id);
        } catch (error) {
          expect(error).toStrictEqual(new VehicleNotFoundError(mockVehicle.id));
        }
      });
    });

    describe('deleteVehicle', function() {
      const vehicleId = mockVehicle.id;

      it('should delete vehicle', async function() {
        await service.deleteVehicle(vehicleId);

        expect(mockVehicleRepository.delete).toBeCalledWith(vehicleId);
      });

      it('should throw vehicle not found', async function() {
        mockVehicleRepository.findOneOrFail.mockImplementationOnce(() => {
          throw new Error();
        });

        try {
          await service.deleteVehicle(vehicleId);
        } catch (error) {
          expect(error).toStrictEqual(new VehicleNotFoundError(vehicleId));
        }
      });

      it('should remove access policy', async function() {
        const policy: PolicyDto = {
          resourceOwnerName: ResourceNameEnum.SQUAD,
          resourceOwnerId: mockVehicle.squadId,
          resourceName: ResourceNameEnum.VEHICLE,
          resourceId: vehicleId,
        };

        await service.deleteVehicle(vehicleId);

        expect(removeAccessRuleOnDeletedUnitSpy).toBeCalledWith(policy);
      });
    });
  });
});
