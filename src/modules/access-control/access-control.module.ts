import { Module } from '@nestjs/common';
import { ENFORCER_TOKEN } from './constants';
import { Enforcer, newEnforcer } from 'casbin';
import { AccessControlService } from './access-control.service';
import TypeORMAdapter from 'typeorm-adapter';
import { LoggerService } from '../../logger/logger.service';
import { CONFIG_TOKEN } from '../../config/constants/config.constant';
import { ConfigModule } from '../../config/config.module';
import { IConfigSchema } from '../../config/interfaces/schema.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ENFORCER_TOKEN,
      useFactory: async (config: IConfigSchema): Promise<Enforcer> => {
        const model = config.casbinEnforcer.pathToModel;
        const adapter = await TypeORMAdapter.newAdapter(config.typeorm);

        return await newEnforcer(model, adapter);
      },
      inject: [CONFIG_TOKEN],
    },
    AccessControlService,
    LoggerService,
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
