import { Test, TestingModule } from '@nestjs/testing';
import { OperatorsController } from '../operators.controller';
import { OperatorRepository } from '../repositories/operator.repository';
import { AccessControlModule } from '../../access-control/access-control.module';
import { ConfigsModule } from '../../configs/configs.module';
import { OperatorsService } from '../operators.service';
import { LoggerService } from '../../../logger/logger.service';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import {
  mockConfigRepository,
  mockOperatorRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import { SquadRepository } from '../../squads/repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockOperator } from '../../../mocks/entities';
import { CreateOperatorDto } from '../DTOs/create-operator.dto';

describe('Operators Controller', () => {
  let controller: OperatorsController;
  let service: OperatorsService;

  const operatorId = mockOperator.id;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([OperatorRepository]), AccessControlModule, ConfigsModule],
      controllers: [OperatorsController],
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

    controller = module.get<OperatorsController>(OperatorsController);
    service = module.get<OperatorsService>(OperatorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOperator', function() {
    it('should return Operator', async function() {
      const getOperatorSpy = jest.spyOn(service, 'getOperator').mockResolvedValueOnce(mockOperator);
      const result = await controller.getOperator(operatorId);

      expect(result).toBe(mockOperator);
      expect(getOperatorSpy).toBeCalledWith(operatorId);
    });
  });

  describe('createOperator', function() {
    it('should call OperatorsService.createOperator', async function() {
      const createOperatorDto: CreateOperatorDto = {
        vehicleId: mockOperator.vehicleId,
      };

      const createOperatorSpy = jest
        .spyOn(service, 'createOperator')
        .mockResolvedValueOnce(mockOperator);
      const result = await controller.createOperator(createOperatorDto);

      expect(result).toBe(mockOperator);
      expect(createOperatorSpy).toBeCalledWith(createOperatorDto);
    });
  });

  describe('deleteOperator', function() {
    it('should call OperatorsService.deleteOperator', async function() {
      const deleteOperatorSpy = jest.spyOn(service, 'deleteOperator').mockResolvedValueOnce(true);

      await controller.deleteOperator(operatorId);

      expect(deleteOperatorSpy).toBeCalledWith(operatorId);
    });
  });
});
