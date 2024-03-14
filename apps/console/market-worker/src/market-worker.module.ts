import { Module } from '@nestjs/common';
import { Console/marketWorkerController } from './console/market-worker.controller';
import { Console/marketWorkerService } from './console/market-worker.service';

@Module({
  imports: [],
  controllers: [Console/marketWorkerController],
  providers: [Console/marketWorkerService],
})
export class Console/marketWorkerModule {}
