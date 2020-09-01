import { define } from 'typeorm-seeding';
import { User } from '../entities/user.entity';

define(User, faker => {
  // @ts-ignore
  const user = new User();

  user.name = faker.name.firstName();
  user.name = faker.name.firstName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();

  return user;
});
