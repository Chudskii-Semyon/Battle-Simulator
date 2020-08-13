import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { CommonModule } from './modules/common/common.module';
import { ArmiesModule } from './modules/armies/armies.module';
import { RolesModule } from './modules/roles/roles.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { SquadsModule } from './modules/squads/squads.module';
import { SoldiersModule } from './modules/soldiers/soldiers.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { BattleGateway } from './modules/battle/battle.gateway';
import { ArmyRepository } from './modules/armies/repositories/army.repository';
import { Army } from './entities/army.entity';
import { BattleService } from './modules/battle/battle.service';
import { UserRepository } from './modules/users/repositories/user.repository';
import { User } from './entities/user.entity';
import { ENFORCER_TOKEN } from './modules/access-control/constants';
import { Enforcer, newEnforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Army, ArmyRepository, User, UserRepository]),
    AuthModule,
    LoggerModule,
    CommonModule,
    ArmiesModule,
    RolesModule,
    AccessControlModule,
    SquadsModule,
    SoldiersModule,
    VehiclesModule,
    OperatorsModule,
  ],
  controllers: [AppController],
  providers: [
    BattleService,
    AppService,
    BattleGateway,
    // {
    //   provide: ENFORCER_TOKEN,
    //   useFactory: async (): Promise<Enforcer> => {
    //     // TODO move to config
    //     // TODO update implementation to use dynamic adapter
    //     const model = join(process.cwd(), '/src/casbin-conf/model.conf');
    //     const adapter = await TypeORMAdapter.newAdapter({
    //       type: 'postgres',
    //       host: 'localhost',
    //       port: 5432,
    //       username: 'postgres',
    //       password: '',
    //       database: 'battle_simulator_database',
    //     });
    //
    //     return await newEnforcer(model, adapter);
    //   },
    // },
  ],
})
export class AppModule {}
