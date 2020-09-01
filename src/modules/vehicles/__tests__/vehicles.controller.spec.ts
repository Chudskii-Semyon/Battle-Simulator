import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from '../vehicles.controller';
import { AccessControlModule } from '../../access-control/access-control.module';
import { ConfigsModule } from '../../configs/configs.module';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { VehiclesService } from '../vehicles.service';
import { LoggerService } from '../../../logger/logger.service';
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockVehicle } from '../../../mocks/entities';
import { CreateVehicleDto } from '../DTOs/createVehicle.dto';
import { OperatorRepository } from '../../operators/repositories/operator.repository';

describe('Vehicles Controller', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  const vehicleId = mockVehicle.id;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccessControlModule, ConfigsModule, TypeOrmModule.forFeature([VehicleRepository])],
      controllers: [VehiclesController],
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
      .overrideProvider(OperatorRepository)
      .useValue(mockOperatorRepository)
      .compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVehicle', function() {
    it('should return Vehicle', async function() {
      const getVehicleSpy = jest.spyOn(service, 'getVehicle').mockResolvedValueOnce(mockVehicle);
      const result = await controller.getVehicle(vehicleId);

      expect(result).toBe(mockVehicle);
      expect(getVehicleSpy).toBeCalledWith(vehicleId);
    });
  });

  describe('createVehicle', function() {
    it('should call VehiclesService.createVehicle', async function() {
      const createVehicleDto: CreateVehicleDto = {
        squadId: mockVehicle.squadId,
      };

      const createVehicleSpy = jest
        .spyOn(service, 'createVehicle')
        .mockResolvedValueOnce(mockVehicle);
      const result = await controller.createVehicle(createVehicleDto);

      expect(result).toBe(mockVehicle);
      expect(createVehicleSpy).toBeCalledWith(createVehicleDto);
    });
  });

  describe('deleteVehicle', function() {
    it('should call VehiclesService.deleteVehicle', async function() {
      const deleteVehicleSpy = jest.spyOn(service, 'deleteVehicle').mockResolvedValueOnce(true);

      await controller.deleteVehicle(vehicleId);

      expect(deleteVehicleSpy).toBeCalledWith(vehicleId);
    });
  });
});
