import { define } from 'typeorm-seeding';
import { User } from '../entities/user.entity';

// const { CASHIER, ACCOUNTANT, SHOP_ASSISTANT } = EmployeeRoleEnum;

define(User, faker => {
  // @ts-ignore
  const user = new User();

  user.name = faker.name.firstName();
  user.name = faker.name.firstName();
  user.email = faker.internet.email();
  user.password = '123456';

  return user;
});
