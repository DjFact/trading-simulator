import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health Gateway Service')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @ApiOperation({ summary: 'Get all health checks' })
  @HealthCheck()
  @Get()
  checkHealth() {
    return this.healthService.checkHealth();
  }
}
