import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ArmiesService } from './armies.service';
import { Army } from '../../entities/army.entity';
import { CreateArmyDto } from './DTOs/create-army.dto';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';
import { LoggerService } from '../../logger/logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';

@UseGuards(JwtAuthGuard, ResourceAccessGuard)
@Controller('armies')
export class ArmiesController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly armiesService: ArmiesService,
    private readonly logger: LoggerService,
  ) {}

  @Get(':id')
  public async getArmy(@Param('id') armyId: number): Promise<Army> {
    this.logger.debug(
      {
        message: `Proceed GetArmy`,
        armyId,
      },
      this.loggerContext,
    );
    return this.armiesService.getArmy(armyId);
  }

  @Post()
  public async createArmy(
    @Body() createArmyDto: CreateArmyDto,
    @WithUser() user: User,
  ): Promise<Army> {
    this.logger.debug(
      {
        message: `Proceed CreateArmy`,
        createArmyDto,
        user,
      },
      this.loggerContext,
    );
    return this.armiesService.createArmy(createArmyDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteArmy(@Param('id') armyId: number, @WithUser() user: User): Promise<boolean> {
    this.logger.debug(
      {
        message: `Proceed DeleteArmy`,
        armyId,
      },
      this.loggerContext,
    );
    return this.armiesService.deleteArmy(armyId, user);
  }
}
