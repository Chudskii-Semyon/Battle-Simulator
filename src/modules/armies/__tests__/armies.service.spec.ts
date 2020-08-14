import { Test, TestingModule } from '@nestjs/testing';
import { ArmiesService } from '../armies.service';
import { LoggerService } from '../../../logger/logger.service';
import { ArmyRepository } from '../repositories/army.repository';
import { AccessControlModule } from '../../access-control/access-control.module';
import { ArmiesController } from '../armies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateArmyDto } from '../DTOs/create-army.dto';
import { mockArmy, mockUser } from '../../../mocks/entities';
import { AccessControlService } from '../../access-control/access-control.service';
import { PolicyDto } from '../../access-control/DTOs/policy.dto';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { ArmyNotFoundError } from '../../../errors/army-not-found.error';
import { mockArmyRepository } from '../../../mocks/repositories';

describe('ArmiesService', () => {
  let service: ArmiesService;
  let accessControlService: AccessControlService;

  let addAccessRuleToCreatedUnitSpy: jest.SpyInstance<Promise<boolean>>;

  beforeEach(() => {
    addAccessRuleToCreatedUnitSpy = jest
      .spyOn(accessControlService, 'addAccessRuleToCreatedUnit')
      .mockResolvedValue(true);
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([ArmyRepository]), AccessControlModule],
      controllers: [ArmiesController],
      providers: [ArmiesService, LoggerService],
    })
      .overrideProvider(ArmyRepository)
      .useValue(mockArmyRepository)
      .compile();

    service = module.get<ArmiesService>(ArmiesService);
    accessControlService = module.get<AccessControlService>(AccessControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createArmy', function() {
    let createArmyDto: CreateArmyDto;

    beforeEach(() => {
      createArmyDto = Object.create({ name: mockArmy.name });
    });

    it('should create new army', async function() {
      const result = await service.createArmy(createArmyDto, mockUser);
      expect(result).toBe(mockArmy);
    });

    it('should create new access policy', async function() {
      await service.createArmy(createArmyDto, mockUser);

      const newPolicy: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.USERS,
        resourceOwnerId: mockUser.id,
        resourceName: ResourceNameEnum.ARMIES,
        resourceId: mockArmy.id,
      };
      //
      expect(addAccessRuleToCreatedUnitSpy).toBeCalledWith(newPolicy);
    });
  });

  describe('getArmy', function() {
    it('should return found army', async function() {
      const result = await service.getArmy(mockArmy.id);

      expect(mockArmyRepository.findOneOrFail).toBeCalledWith(mockArmy.id);
      expect(result).toBe(mockArmy);
    });

    it('should throw error if army is not found', async function() {
      try {
        mockArmyRepository.findOneOrFail.mockImplementationOnce(() => {
          throw new ArmyNotFoundError(mockArmy.id);
        });

        await service.getArmy(mockArmy.id);

        fail('doesnt throw expected error');
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe('deleteArmy', function() {
    it('should delete army', async function() {
      await service.deleteArmy(mockArmy.id, mockUser);

      expect(mockArmyRepository.delete).toBeCalledWith(mockArmy.id);
    });

    it('should remove privacy policy', async function() {
      const removeAccessRuleOnDeletedUnitSpy = jest.spyOn(
        accessControlService,
        'removeAccessRuleOnDeletedUnit',
      );
      await service.deleteArmy(mockArmy.id, mockUser);

      const policyToDelete: PolicyDto = {
        resourceOwnerName: ResourceNameEnum.USERS,
        resourceOwnerId: mockUser.id,
        resourceName: ResourceNameEnum.ARMIES,
        resourceId: mockArmy.id,
      };

      expect(removeAccessRuleOnDeletedUnitSpy).toBeCalledWith(policyToDelete);
    });
    it('should throw error if error occurred', async function() {
      try {
        mockArmyRepository.delete.mockImplementationOnce(() => {
          throw new Error();
        });
        await service.deleteArmy(mockArmy.id, mockUser);
        fail('doesnt throw expected error');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
