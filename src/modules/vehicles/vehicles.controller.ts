import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './DTOs/createVehicle.dto';
import { WithUser } from '../common/decorators/with-user.decorator';
import { User } from '../../entities/user.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../access-control/guards/resource-access.guard';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, ResourceAccessGuard)
export class VehiclesController {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly logger: LoggerService,
  ) {}

  @Get(':id')
  public async getVehicle(@Param('id') vehicleId: number): Promise<Vehicle> {
    this.logger.debug(
      {
        message: `Proceed GetVehicle`,
        vehicleId,
      },
      this.loggerContext,
    );

    return this.vehiclesService.getVehicle(vehicleId);
  }

  @Post()
  public async createVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
    @WithUser() user: User,
  ): Promise<Vehicle> {
    this.logger.debug(
      {
        message: `Proceed CreateVehicle`,
        createVehicleDto,
        user,
      },
      this.loggerContext,
    );

    return this.vehiclesService.createVehicle(createVehicleDto, user);
  }
}
