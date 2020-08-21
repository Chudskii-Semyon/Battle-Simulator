import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepository } from '../repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockUserRepository } from '../../../mocks/repositories';
import { LoggerService } from '../../../logger/logger.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserRepository])],
      providers: [UsersService, LoggerService],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
