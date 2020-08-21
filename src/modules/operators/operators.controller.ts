import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { LoggerService } from '../../logger/logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';
import { CreateOperatorDto } from './DTOs/create-operator.dto';
import { Operator } from '../../entities/operator.entity';

@Controller('operators')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class OperatorsController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly logger: LoggerService,
    private readonly operatorsService: OperatorsService,
  ) {}

  @Get()
  public async getOperators(@Body('vehicleId') vehicleId: number): Promise<Operator[]> {
    this.logger.debug(
      {
        message: `Proceed GetOperators`,
      },
      this.loggerContext,
    );
    return this.operatorsService.getOperators(vehicleId);
  }

  @Get(':operatorId')
  public async getOperator(@Param('operatorId') operatorId: number): Promise<Operator> {
    this.logger.debug(
      {
        message: `Proceed GetOperator`,
      },
      this.loggerContext,
    );

    return this.operatorsService.getOperator(operatorId);
  }

  @Post()
  public async createOperator(@Body() createOperatorDto: CreateOperatorDto): Promise<Operator> {
    this.logger.debug(
      {
        message: `Proceed CreateOperator`,
        createOperatorDto,
      },
      this.loggerContext,
    );

    return this.operatorsService.createOperator(createOperatorDto);
  }

  @Delete(':operatorId')
  @HttpCode(204)
  public async deleteOperator(@Param('operatorId') operatorId: number): Promise<void> {
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
