import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ArmyRepository } from '../armies/repositories/army.repository';
import { LoggerService } from '../../logger/logger.service';
import { BattleService } from './battle.service';
import { UserRepository } from '../users/repositories/user.repository';
import { BATTLE_START } from './constants/socket-events.constant';
import { BattleSimulationProcessor } from './processors/battle-simulation.processor';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';
import { BattleStartDto } from './DTOs/battle-start.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class BattleGateway {
  private readonly loggerContext = this.constructor.name;
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly logger: LoggerService,
    private readonly armiesRepository: ArmyRepository,
    private readonly userRepository: UserRepository,
    private readonly battleService: BattleService,
    private readonly battleSimulatorProcessor: BattleSimulationProcessor,
  ) {}

  public afterInit(server: Server): void {
    this.battleService.socket = server;
    this.battleSimulatorProcessor.socket = server;
  }

  @SubscribeMessage(BATTLE_START)
  async battleStart(
    @MessageBody() battleStartDto: BattleStartDto,
    @WithUser() user: User,
  ): Promise<void> {
    this.logger.debug(
      {
        message: `Proceed battle start socket`,
        battleStartDto,
        user,
      },
      this.loggerContext,
    );

    await this.battleService.battleStart(battleStartDto, user);
  }
}
