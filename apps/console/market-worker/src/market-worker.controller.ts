import { Controller, Get } from '@nestjs/common';
import { Console/marketWorkerService } from './console/market-worker.service';

@Controller()
export class Console/marketWorkerController {
  constructor(private readonly console/marketWorkerService: Console/marketWorkerService) {}

  @Get()
  getHello(): string {
    return this.console/marketWorkerService.getHello();
  }
}
