import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './DTOs/createVehicle.dto';
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

  @Get()
  public async getVehicles(@Body('squadId') squadId: number): Promise<Vehicle[]> {
    this.logger.debug(
      {
        message: `Proceed GetVehicles`,
        squadId,
      },
      this.loggerContext,
    );
    return this.vehiclesService.getVehicles(squadId);
  }

  @Get(':vehicleId')
  public async getVehicle(@Param('vehicleId') vehicleId: number): Promise<Vehicle> {
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
  public async createVehicle(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    this.logger.debug(
      {
        message: `Proceed CreateVehicle`,
        createVehicleDto,
      },
      this.loggerContext,
    );

    return this.vehiclesService.createVehicle(createVehicleDto);
  }

  @Delete(':vehicleId')
  @HttpCode(204)
  public async deleteVehicle(@Param('vehicleId') vehicleId: number): Promise<void> {
    this.logger.debug(
      {
        message: `Proceed DeleteVehicle`,
        vehicleId,
      },
      this.loggerContext,
    );

    await this.vehiclesService.deleteVehicle(vehicleId);
  }
}
