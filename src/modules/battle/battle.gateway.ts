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
  async battleStart(@MessageBody() data: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail(1);

    await this.battleService.battleStart(5, user);
  }
}
