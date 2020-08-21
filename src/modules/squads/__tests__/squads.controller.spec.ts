import { Test, TestingModule } from '@nestjs/testing';
import { SquadsController } from '../squads.controller';
import { ConfigsModule } from '../../configs/configs.module';
import { AccessControlModule } from '../../access-control/access-control.module';
import { SquadRepository } from '../repositories/squad.repository';
import { SquadsService } from '../squads.service';
import { LoggerService } from '../../../logger/logger.service';
import {
  mockConfigRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockSquad } from '../../../mocks/entities';
import { CreateSquadDto } from '../DTOs/create-squad.dto';
import { StrategyEnum } from '../../../enums/strategy.enum';

describe('Squads Controller', () => {
  let controller: SquadsController;
  let service: SquadsService;

  const squadId = mockSquad.id;

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

    controller = module.get<SquadsController>(SquadsController);
    service = module.get<SquadsService>(SquadsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSquad', function() {
    it('should return squad', async function() {
      const getSquadSpy = jest.spyOn(service, 'getSquad').mockResolvedValueOnce(mockSquad);
      const result = await controller.getSquad(squadId);

      expect(result).toBe(mockSquad);
      expect(getSquadSpy).toBeCalledWith(squadId);
    });
  });

  describe('createSquad', function() {
    it('should call squadsService.createSquad', async function() {
      const createSquadDto: CreateSquadDto = {
        name: mockSquad.name,
        strategy: StrategyEnum.RANDOM,
        armyId: mockSquad.armyId,
      };

      const createSquadSpy = jest.spyOn(service, 'createSquad').mockResolvedValueOnce(mockSquad);
      const result = await controller.createSquad(createSquadDto);

      expect(result).toBe(mockSquad);
      expect(createSquadSpy).toBeCalledWith(createSquadDto);
    });
  });

  describe('deleteSquad', function() {
    it('should call squadsService.deleteSquad', async function() {
      const deleteSquadSpy = jest.spyOn(service, 'deleteSquad').mockResolvedValueOnce(true);

      await controller.deleteSquad(squadId);

      expect(deleteSquadSpy).toBeCalledWith(squadId);
    });
  });
});
