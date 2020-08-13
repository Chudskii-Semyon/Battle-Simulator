import { Test, TestingModule } from '@nestjs/testing';
import { SquadsService } from '../squads.service';
import { AccessControlModule } from '../../access-control/access-control.module';
import { SquadRepository } from '../repositories/squad.repository';
import { ConfigRepository } from '../../configs/repositories/config.repository';
import { SoldierRepository } from '../../soldiers/repositories/soldier.repository';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { SquadsController } from '../squads.controller';
import { ConfigsService } from '../../configs/configs.service';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockSquad } from '../../../mocks/entities/squad.mock';

describe('SquadsService', () => {
  let service: SquadsService;

  let mockSquadRepository;

  beforeAll(async () => {
    mockSquadRepository = {
      save: jest.fn().mockReturnValue(mockSquad),
      create: jest.fn().mockReturnValue(mockSquad),
      findOneOrFail: jest.fn().mockReturnValue(mockSquad),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccessControlModule,
        TypeOrmModule.forFeature([
          SquadRepository,
          ConfigRepository,
          SoldierRepository,
          VehicleRepository,
        ]),
      ],
      controllers: [SquadsController],
      providers: [SquadsService, ConfigsService, LoggerService],
    })
      .overrideProvider(SquadRepository)
      .useValue(mockSquadRepository)
      .compile();

    service = module.get<SquadsService>(SquadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
