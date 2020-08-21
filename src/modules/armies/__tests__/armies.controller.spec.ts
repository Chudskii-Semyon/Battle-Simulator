import { Test, TestingModule } from '@nestjs/testing';
import { ArmiesController } from '../armies.controller';
import { ArmyRepository } from '../repositories/army.repository';
import { AccessControlModule } from '../../access-control/access-control.module';
import { ArmiesService } from '../armies.service';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockArmyRepository } from '../../../mocks/repositories';
import { mockArmy, mockUser } from '../../../mocks/entities';
import { CreateArmyDto } from '../DTOs/create-army.dto';

describe('Armies Controller', () => {
  let controller: ArmiesController;
  let service: ArmiesService;

  const armyId = mockArmy.id;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArmiesController],
      imports: [TypeOrmModule.forFeature([ArmyRepository]), AccessControlModule],
      providers: [ArmiesService, LoggerService],
    })
      .overrideProvider(ArmyRepository)
      .useValue(mockArmyRepository)
      .compile();

    controller = module.get<ArmiesController>(ArmiesController);
    service = module.get<ArmiesService>(ArmiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getArmy', function() {
    it('should return army by id', async function() {
      const getArmySpy = jest.spyOn(service, 'getArmy').mockResolvedValueOnce(mockArmy);
      const result = await controller.getArmy(armyId);

      expect(result).toBe(mockArmy);
      expect(getArmySpy).toBeCalledWith(armyId);
    });
  });

  describe('createArmy', function() {
    it('should return created army', async function() {
      const createArmyDto: CreateArmyDto = {
        name: mockArmy.name,
      };
      const createArmySpy = jest.spyOn(service, 'createArmy').mockResolvedValueOnce(mockArmy);
      const result = await controller.createArmy(createArmyDto, mockUser);

      expect(result).toBe(mockArmy);
      expect(createArmySpy).toBeCalledWith(createArmyDto, mockUser);
    });
  });

  describe('deleteArmy', function() {
    it('should call armiesService.deleteArmy', async function() {
      const deleteArmySpy = jest.spyOn(service, 'deleteArmy').mockResolvedValueOnce(true);

      await controller.deleteArmy(armyId, mockUser);

      expect(deleteArmySpy).toBeCalledWith(armyId, mockUser);
    });
  });
});
