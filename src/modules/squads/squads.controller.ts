import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { SquadsService } from './squads.service';
import { CreateSquadDto } from './DTOs/create-squad.dto';
import { Squad } from '../../entities/squad.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';

@Controller('squads')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class SquadsController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    private readonly squadsService: SquadsService,
  ) {}

  @Get()
  public async getSquads(@Body('armyId') armyId: number): Promise<Squad[]> {
    this.logger.debug(
      {
        message: `Proceed GetSquads`,
        armyId,
      },
      this.loggerContext,
    );
    return this.squadsService.getSquads(armyId);
  }

  @Get(':squadId')
  public async getSquad(@Param('squadId') squadId: number): Promise<Squad> {
    this.logger.debug(
      {
        message: `Proceed GetSquad`,
        squadId,
      },
      this.loggerContext,
    );

    return this.squadsService.getSquad(squadId);
  }

  @Post()
  public async createSquad(@Body() createSquadDto: CreateSquadDto): Promise<Squad> {
    this.logger.debug(
      {
        message: `Proceed CreateSquad`,
        createSquadDto,
      },
      this.loggerContext,
    );

    return this.squadsService.createSquad(createSquadDto);
  }

  @Delete(':squadId')
  @HttpCode(204)
  public async deleteSquad(@Param('squadId') squadId: number): Promise<void> {
    this.logger.debug(
      {
        message: `Proceed DeleteSquad`,
        squadId,
      },
      this.loggerContext,
    );

    await this.squadsService.deleteSquad(squadId);
  }
}
