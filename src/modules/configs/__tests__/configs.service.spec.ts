import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsService } from '../configs.service';
import { ConfigRepository } from '../repositories/config.repository';
import { SquadRepository } from '../../squads/repositories/squad.repository';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  mockConfigRepository,
  mockSoldierRepository,
  mockSquadRepository,
  mockVehicleRepository,
} from '../../../mocks/repositories';
import { mockArmy, mockConfig, mockSquad } from '../../../mocks/entities';
import { MaxUnitsPerSquadHasBeenReachedError } from '../../../errors/maximum-units-per-squad-has-bean-reached.error';
import { MaxNumberOfSquadsHasBeenReachedError } from '../../../errors/max-number-of-squads-has-been-reached.error';

describe('ConfigsService', () => {
  let service: ConfigsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          ConfigRepository,
          SquadRepository,
          SoldierRepository,
          VehicleRepository,
        ]),
      ],
      providers: [ConfigsService, LoggerService],
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

    service = module.get<ConfigsService>(ConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateNumberOfUnitsPerSquadOrFail', function() {
    const squadId = mockSquad.id;
    it('should count vehicles by squad id', async function() {
      await service.validateNumberOfUnitsPerSquadOrFail(squadId);

      expect(mockVehicleRepository.countVehiclesBySquadId).toBeCalledWith(squadId);
    });

    it('should count soldiers by squad id', async function() {
      await service.validateNumberOfUnitsPerSquadOrFail(squadId);

      expect(mockSoldierRepository.countSoldiersBySquadId).toBeCalledWith(squadId);
    });

    it('should find an active config', async function() {
      await service.validateNumberOfUnitsPerSquadOrFail(squadId);

      expect(mockConfigRepository.findActiveConfig).toBeCalled();
    });

    it('should throw error if sum of soldiers and vehicles greater than specified in config', async function() {
      const valueGreaterThanSpecifiedInConfig = mockConfig.numberOfUnitsPerSquad + 1;

      mockSoldierRepository.countSoldiersBySquadId.mockReturnValueOnce(
        valueGreaterThanSpecifiedInConfig,
      );
      mockVehicleRepository.countVehiclesBySquadId.mockReturnValueOnce(
        valueGreaterThanSpecifiedInConfig,
      );

      try {
        await service.validateNumberOfUnitsPerSquadOrFail(squadId);

        fail('did not throw expected error');
      } catch (error) {
        expect(error).toStrictEqual(new MaxUnitsPerSquadHasBeenReachedError());
      }
    });

    it('should return true if successfully passed validation', async function() {
      const result = await service.validateNumberOfUnitsPerSquadOrFail(squadId);

      expect(result).toBeTruthy();
    });
  });

  describe('validateNumberOfSquadsPerOrFail', function() {
    const armyId = mockArmy.id;

    it('should count squads by army id', async function() {
      await service.validateNumberOfSquadsPerArmyOrFail(armyId);

      expect(mockSquadRepository.countSquadsByArmyId).toBeCalledWith(armyId);
    });

    it('should find an active config', async function() {
      await service.validateNumberOfSquadsPerArmyOrFail(armyId);

      expect(mockConfigRepository.findActiveConfig).toBeCalled();
    });

    it('should throw MaxNumberOfSquadsHasBeenReachedError if fethed number of squads greater than specified in config', async function() {
      mockSquadRepository.countSquadsByArmyId.mockReturnValueOnce(
        mockConfig.numberOfSquadsPerArmy + 1,
      );

      try {
        await service.validateNumberOfSquadsPerArmyOrFail(armyId);
      } catch (error) {
        expect(error).toStrictEqual(new MaxNumberOfSquadsHasBeenReachedError());
      }
    });
  });
});
