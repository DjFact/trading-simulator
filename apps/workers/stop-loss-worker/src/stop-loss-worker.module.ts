import { Logger, Module } from '@nestjs/common';
import { StopLossWorkerService } from './stop-loss-worker.service';
import {
  getConfigModule,
  getSequelizeModuleRoot,
  getWinstonLoggerModule,
} from '../../../../common/module.utils';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { MqModule } from '../../../../common/mq/mq.module';
import { StrategyModule } from '../../strategy/strategy.module';

@Module({
  imports: [
    getConfigModule(MicroserviceEnum.MarketWorker),
    getWinstonLoggerModule(),
    getSequelizeModuleRoot(),
    ClientProxyModule,
    StrategyModule,
    MqModule,
  ],
  providers: [StopLossWorkerService, Logger],
})
export class StopLossWorkerModule {}
