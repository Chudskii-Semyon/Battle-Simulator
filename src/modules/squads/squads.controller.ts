import { Controller, Post, Body, UseGuards, Get, Param, Delete, HttpCode } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { SquadsService } from './squads.service';
import { CreateSquadDto } from './DTOs/create-squad.dto';
import { Squad } from '../../entities/squad';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('squads')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class SquadsController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    private readonly squadsService: SquadsService,
  ) {}

  @Get(':id')
  public async getSquad(@Param('id') squadId: number): Promise<Squad> {
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
  public async createSquad(
    @Body() createSquadDto: CreateSquadDto,
    @WithUser() user: User,
  ): Promise<Squad> {
    this.logger.debug(
      {
        message: `Proceed CreateSquad`,
        createSquadDto,
      },
      this.loggerContext,
    );

    return this.squadsService.createSquad(createSquadDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteSquad(@Param('id') squadId: number): Promise<void> {
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
