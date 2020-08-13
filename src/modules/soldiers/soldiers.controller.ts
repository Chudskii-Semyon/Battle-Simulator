import { Controller, Post, Body, UseGuards, Param, Get, Delete, HttpCode } from '@nestjs/common';
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
    private readonly soldierService: SoldiersService,
  ) {}

  @Get(':id')
  public async getSoldier(@Param('id') soldierId: number): Promise<Soldier> {
    this.logger.debug(
      {
        message: `Proceed GetSoldier`,
        soldierId,
      },
      this.loggerContext,
    );

    return this.soldierService.getSoldier(soldierId);
  }

  @Post()
  public async createSoldier(
    @Body() createSoldierDto: CreateSoldierDto,
    @WithUser() user: User,
  ): Promise<Soldier> {
    this.logger.debug(
      {
        message: `Proceed CreateSoldier`,
        createSoldierDto,
        user,
      },
      this.loggerContext,
    );

    return this.soldierService.createSoldier(createSoldierDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteSoldier(@Param() soldierId: number): Promise<void> {
    this.logger.debug(
      {
        message: `Proceed DeleteSoldier`,
        soldierId,
      },
      this.loggerContext,
    );

    await this.soldierService.deleteSoldier(soldierId);
  }
}
