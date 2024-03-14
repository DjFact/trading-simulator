import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { StorageHealthCheckService } from './storage-health.service';
import { plainToInstance } from 'class-transformer';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { HealthServiceUnavailableException } from './health-service-unavailable.exception';
import { CommonConfigurationEnum } from '../../../../common/enum/common-configuration.enum';

@Injectable()
export class HealthService {
  constructor(
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
    private memoryHealth: MemoryHealthIndicator,
    private storageHealth: StorageHealthCheckService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    const { memory, disk } = this.configService.get(
      CommonConfigurationEnum.Health,
    );

    try {
      return this.healthCheckService.check([
        () =>
          this.memoryHealth.checkHeap(
            'memory heap',
            memory.heapMB * 1024 * 1024,
          ),
        () =>
          this.memoryHealth.checkRSS('memory RSS', memory.rssMB * 1024 * 1024),
        ...this.storageHealth.storageCheck(disk),
      ]);
    } catch (err) {
      throw plainToInstance(HealthServiceUnavailableException, err);
    }
  }
}
