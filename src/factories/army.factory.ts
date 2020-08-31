import { define, factory } from 'typeorm-seeding';
import { User } from '../entities/user.entity';
import { Army } from '../entities/army.entity';

define(Army, faker => {
  // @ts-ignore
  const army = new Army();

  army.name = faker.lorem.word();
  army.user = factory(User)() as any;

  return army;
});
