import { Config, Schema } from 'convict';
import { Provider } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { IConfigSchema } from '../interfaces/schema.interface';
import {
  CONFIG_SCHEMA_TOKEN,
  CONFIG_TOKEN,
  CONVICT_MODULE_TOKEN,
} from '../constants/config.constant';

export const configProvider: Provider = {
  provide: CONFIG_TOKEN,
  useFactory: (
    convictModule,
    schema: Schema<IConfigSchema>,
    logger: LoggerService,
  ): IConfigSchema => {
    const config: Config<IConfigSchema> = convictModule(schema);
    config.validate();

    logger.log({
      message: 'Config validation completed',
      config: config.getProperties(),
    });
    return config.getProperties();
  },
  inject: [CONVICT_MODULE_TOKEN, CONFIG_SCHEMA_TOKEN, LoggerService],
};
