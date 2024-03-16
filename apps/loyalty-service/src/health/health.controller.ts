import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { AuthCommandEnum } from '../../../../common/enum/auth-command.enum';

@Controller()
export class HealthController {
  constructor(
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
    private memoryHealth: MemoryHealthIndicator,
    private dbHealth: SequelizeHealthIndicator,
  ) {}

  @MessagePattern({ cmd: AuthCommandEnum.HealthCheck })
  checkDbHealth() {
    const { memory } = this.configService.get('health');
    return this.healthCheckService.check([
      () => this.dbHealth.pingCheck('database'),
      () =>
        this.memoryHealth.checkHeap('memory heap', memory.heapMB * 1024 * 1024),
      () =>
        this.memoryHealth.checkRSS('memory RSS', memory.rssMB * 1024 * 1024),
    ]);
  }
}
