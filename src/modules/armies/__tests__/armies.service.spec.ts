import { Test, TestingModule } from '@nestjs/testing';
import { ArmiesService } from '../armies.service';

describe('ArmiesService', () => {
  let service: ArmiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArmiesService],
    }).compile();

    service = module.get<ArmiesService>(ArmiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
