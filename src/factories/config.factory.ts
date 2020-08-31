import { define } from 'typeorm-seeding';
import { Config } from '../entities/config.entity';

define(Config, faker => {
  // @ts-ignore
  const config = new Config();

  return config;
});
