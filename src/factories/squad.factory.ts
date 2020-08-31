import { define, factory } from 'typeorm-seeding';
import { Squad } from '../entities/squad.entity';
import { StrategyEnum } from '../enums/strategy.enum';
import { Army } from '../entities/army.entity';

// const { CASHIER, ACCOUNTANT, SHOP_ASSISTANT } = EmployeeRoleEnum;

define(Squad, faker => {
  // @ts-ignore
  const squad = new Squad();

  squad.name = faker.lorem.word();
  squad.strategy = StrategyEnum.RANDOM;
  squad.army = factory(Army)() as any;

  return squad;
});
