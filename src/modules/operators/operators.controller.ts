import { Controller, UseGuards, Post, Body, Get, Param, Delete, HttpCode } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { LoggerService } from '../../logger/logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';
import { CreateOperatorDto } from './DTOs/create-operator.dto';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';
import { Operator } from '../../entities/operator.entity';

@Controller('operators')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class OperatorsController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    private readonly operatorsService: OperatorsService,
  ) {}

  @Get(':id')
  public async getOperator(@Param('id') operatorId: number): Promise<Operator> {
    this.logger.debug(
      {
        message: `Proceed GetOperator`,
      },
      this.loggerContext,
    );

    return this.operatorsService.getOperator(operatorId);
  }

  @Post()
  public async createOperator(
    @Body() createOperatorDto: CreateOperatorDto,
    @WithUser() user: User,
  ): Promise<Operator> {
    this.logger.debug(
      {
        message: `Proceed CreateOperator`,
        createOperatorDto,
        user,
      },
      this.loggerContext,
    );

    return this.operatorsService.createOperator(createOperatorDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteOperator(@Param('id') operatorId: number): Promise<void> {
    this.logger.debug(
      {
        message: `Proceed DeleteOperator`,
        operatorId,
      },
      this.loggerContext,
    );

    await this.operatorsService.deleteOperator(operatorId);
  }
}
