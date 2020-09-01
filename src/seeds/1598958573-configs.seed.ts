import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Config } from '../entities/config.entity';
import { ConfigActive } from '../entities/config.active';

export class ConfigsSeed1598958573 implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Config)()
      .map(async config => {
        await factory(ConfigActive)()
          .map(async activeConfig => {
            activeConfig.configId = config.id;

            return activeConfig;
          })
          .create();

        return config;
      })
      .create();
  }
}
