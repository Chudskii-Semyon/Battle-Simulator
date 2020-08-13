import { Test, TestingModule } from '@nestjs/testing';
import { ArmiesController } from '../armies.controller';

describe('Armies Controller', () => {
  let controller: ArmiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArmiesController],
    }).compile();

    controller = module.get<ArmiesController>(ArmiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
