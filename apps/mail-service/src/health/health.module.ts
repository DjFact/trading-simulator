import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { StorageHealthCheckModule } from '../../../gateway/src/health/storage-health.module';

@Module({
  imports: [TerminusModule, ConfigModule, StorageHealthCheckModule],
  controllers: [HealthController],
})
export class HealthModule {}
