import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { StorageHealthCheckModule } from './storage-health.module';
import { HealthService } from './health.service';

@Module({
  imports: [TerminusModule, ConfigModule, StorageHealthCheckModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
