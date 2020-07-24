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

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Army, ArmyRepository]),
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
  providers: [AppService, BattleGateway],
})
export class AppModule {}
