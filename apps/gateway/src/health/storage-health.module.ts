import { TerminusModule } from '@nestjs/terminus';
import { Module, Logger } from '@nestjs/common';
import { StorageHealthCheckService } from './storage-health.service';
import { getWinstonLoggerModule } from '../../../../common/module.utils';

@Module({
  imports: [TerminusModule, getWinstonLoggerModule()],
  providers: [Logger, StorageHealthCheckService],
  exports: [StorageHealthCheckService],
})
export class StorageHealthCheckModule {}
