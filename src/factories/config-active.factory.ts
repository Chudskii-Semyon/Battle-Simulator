import { define, factory } from 'typeorm-seeding';
import { ConfigActive } from '../entities/config.active';
import { Config } from '../entities/config.entity';

define(ConfigActive, faker => {
  // @ts-ignore
  const configActive = new ConfigActive();

  configActive.config = factory(Config)() as any;

  return configActive;
});
