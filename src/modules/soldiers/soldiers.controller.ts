import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { SoldiersService } from './soldiers.service';
import { CreateSoldierDto } from './DTOs/createSoldier.dto';
import { Soldier } from '../../entities/soldier.entity';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';

@Controller('soldiers')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class SoldiersController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    private readonly soldiersService: SoldiersService,
  ) {}

  @Get()
  public async getSoldiers(
    @Body('squadId') squadId: number,
    @WithUser() user: User,
  ): Promise<Soldier[]> {
    this.logger.debug(
      {
        message: `Proceed GetSoldiers`,
        user,
      },
      this.loggerContext,
    );
    return this.soldiersService.getSoldiers(squadId);
  }

  @Get(':soldierId')
  public async getSoldier(@Param('soldierId') soldierId: number): Promise<Soldier> {
    this.logger.debug(
      {
        message: `Proceed GetSoldier`,
        soldierId,
      },
      this.loggerContext,
    );

    return this.soldiersService.getSoldier(soldierId);
  }

  @Post()
  public async createSoldier(@Body() createSoldierDto: CreateSoldierDto): Promise<Soldier> {
    this.logger.debug(
      {
        message: `Proceed CreateSoldier`,
        createSoldierDto,
      },
      this.loggerContext,
    );

    return this.soldiersService.createSoldier(createSoldierDto);
  }

  @Delete(':soldierId')
  @HttpCode(204)
  public async deleteSoldier(@Param('soldierId') soldierId: number): Promise<void> {
    this.logger.debug(
      {
        message: `Proceed DeleteSoldier`,
        soldierId,
      },
      this.loggerContext,
    );

    await this.soldiersService.deleteSoldier(soldierId);
  }
}
