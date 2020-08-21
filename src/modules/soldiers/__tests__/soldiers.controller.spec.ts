import { Test, TestingModule } from '@nestjs/testing';
import { SoldiersController } from '../soldiers.controller';
import { SoldierRepository } from '../repositories/soldier.repository';
import { ConfigsModule } from '../../configs/configs.module';
import { AccessControlModule } from '../../access-control/access-control.module';
import { SoldiersService } from '../soldiers.service';
import { LoggerService } from '../../../logger/logger.service';
import {
  mockConfigRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { SquadRepository } from '../../squads/repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockSoldier } from '../../../mocks/entities';
import { CreateSoldierDto } from '../DTOs/createSoldier.dto';

describe('Soldiers Controller', () => {
  let controller: SoldiersController;
  let service: SoldiersService;

  const soldierId = mockSoldier.id;

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

    controller = module.get<SoldiersController>(SoldiersController);
    service = module.get<SoldiersService>(SoldiersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSoldier', function() {
    it('should return Soldier', async function() {
      const getSoldierSpy = jest.spyOn(service, 'getSoldier').mockResolvedValueOnce(mockSoldier);
      const result = await controller.getSoldier(soldierId);

      expect(result).toBe(mockSoldier);
      expect(getSoldierSpy).toBeCalledWith(soldierId);
    });
  });

  describe('createSoldier', function() {
    it('should call SoldiersService.createSoldier', async function() {
      const createSoldierDto: CreateSoldierDto = {
        squadId: mockSoldier.squadId,
      };

      const createSoldierSpy = jest
        .spyOn(service, 'createSoldier')
        .mockResolvedValueOnce(mockSoldier);
      const result = await controller.createSoldier(createSoldierDto);

      expect(result).toBe(mockSoldier);
      expect(createSoldierSpy).toBeCalledWith(createSoldierDto);
    });
  });

  describe('deleteSoldier', function() {
    it('should call SoldiersService.deleteSoldier', async function() {
      const deleteSoldierSpy = jest.spyOn(service, 'deleteSoldier').mockResolvedValueOnce(true);

      await controller.deleteSoldier(soldierId);

      expect(deleteSoldierSpy).toBeCalledWith(soldierId);
    });
  });
});
