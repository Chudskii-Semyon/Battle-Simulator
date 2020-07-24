import { Module, DynamicModule } from '@nestjs/common';
import { ENFORCER_TOKEN } from './constants';
import { Enforcer, newEnforcer } from 'casbin';
import { join } from 'path';
import { AccessControlService } from './access-control.service';
import TypeORMAdapter from 'typeorm-adapter';
import { LoggerService } from '../../logger/logger.service';

@Module({
  providers: [
    {
      provide: ENFORCER_TOKEN,
      useFactory: async (): Promise<Enforcer> => {
        // TODO move to config
        // TODO update implementation to use dynamic adapter
        const model = join(process.cwd(), '/src/casbin-conf/model.conf');
        const adapter = await TypeORMAdapter.newAdapter({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '',
          database: 'battle_simulator_database',
        });

        return await newEnforcer(model, adapter);
      },
    },
    AccessControlService,
    LoggerService,
  ],
  exports: [AccessControlService, ENFORCER_TOKEN],
})
export class AccessControlModule {}
