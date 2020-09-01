import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';

export class UsersSeed1598965774 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const users = await factory(User)().createMany(10, { password: '123456Aa' });
  }
}
