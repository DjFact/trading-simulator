import { ConfigService } from '@nestjs/config';
import { Controller } from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { MessagePattern } from '@nestjs/microservices';
import { MailCommandEnum } from '../../../../common/enum/mail-command.enum';

@Controller()
export class HealthController {
  constructor(
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
    private memoryHealth: MemoryHealthIndicator,
  ) {}

  @MessagePattern({ cmd: MailCommandEnum.HealthCheck })
  checkDbHealth() {
    const { memory } = this.configService.get('health');

    return this.healthCheckService.check([
      () =>
        this.memoryHealth.checkHeap('memory heap', memory.heapMB * 1024 * 1024),
      () =>
        this.memoryHealth.checkRSS('memory RSS', memory.rssMB * 1024 * 1024),
    ]);
  }
}
